import { createFileRoute } from '@tanstack/react-router';
import { azure } from '@ai-sdk/azure';
import {
  APICallError,
  Output,
  createIdGenerator,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText
} from 'ai';
import { quizShowSchema } from '../../data/quizshow/schema';
import prompt from '../../data/quizshow/prompt.md?raw';
import { generateImage } from './tools';
import type { DeepPartial, ModelMessage, UIMessage } from 'ai';
import type { QuizShowType } from '../../data/quizshow/schema';
import { getDataPart, getMessageText } from '@/utils/UIMessageHelper';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const generateId = createIdGenerator({ size: 8 });

function convertObjectToModelMessages(messages: Array<UIMessage>): Array<ModelMessage> {
  const result = messages.map((message) => {
    let content = '';

    if (message.role === 'assistant') {
      content = JSON.stringify(getDataPart(message, 'data-quiz'));
    } else {
      content = getMessageText(message);
    }

    return { content: content, role: message.role } as ModelMessage;
  });

  return result;
}

export const Route = createFileRoute('/api/quizshow')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { messages }: { messages: Array<UIMessage> } = await request.json();
          const id = generateId();

          const stream = createUIMessageStream({
            execute: async ({ writer }) => {
              const result = streamText({
                model: azure('gpt-4.1'),
                // https://github.com/vercel/ai/issues/8868
                providerOptions: {
                  openai: {
                    structuredOutputs: true,
                    strictJsonSchema: true,
                  },
                },
                temperature: 0.95,
                output: Output.object({ schema: quizShowSchema }),
                system: prompt,
                messages: convertObjectToModelMessages(messages),
                maxRetries: 0,
              });
              // const result = streamObject({
              //   model: azure('gpt-4.1'),
              //   temperature: 0.95,
              //   schema: quizShowSchema,
              //   system: prompt,
              //   messages: convertObjectToModelMessages(messages),
              //   maxRetries: 0,
              // });

              const outputStream = result.partialOutputStream;
              const fullStream = result.fullStream;

              let lastObject: DeepPartial<QuizShowType> = {};

              writer.write({ type: 'text-start', id });

              // outputStream
              for await (const chunk of outputStream) {
                if (lastObject.speak !== chunk.speak) {
                  writer.write({
                    type: 'text-delta',
                    id,
                    delta: chunk.speak?.replace(lastObject.speak || '', '') || '',
                  });
                }
                lastObject = chunk;
              }

              // errors from fullStream
              for await (const chunk of fullStream) {
                if (chunk.type === 'error') {
                  if (APICallError.isInstance(chunk.error)) {
                    const err = new APICallError(chunk.error);
                    writer.write({ type: 'error', errorText: JSON.stringify(err.message) });
                  } else {
                    writer.write({ type: 'error', errorText: 'unknown error' });
                  }
                }
              }

              writer.write({ type: 'text-end', id });

              // alles auf einmal - am Ende
              const obj = lastObject;
              // const obj = await result.output;
              writer.write({ type: 'data-quiz', data: obj });

              if (obj.imagePrompt) {
                const image = await generateImage({ prompt: obj.imagePrompt, hdQuality: true, style: 'vivid' });
                writer.write({ type: 'file', mediaType: image.mediaType, url: image.url });
              }
            },
            originalMessages: messages,
          });

          return createUIMessageStreamResponse({ stream });
        } catch (error) {
          if (APICallError.isInstance(error)) {
            return Response.json(error.message, { status: error.statusCode });
          }
          return Response.json({ error: 'Unknown error' }, { status: 500 });
        }
      },
    },
  },
});
