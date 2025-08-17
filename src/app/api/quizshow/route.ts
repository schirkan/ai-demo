import { azure } from '@ai-sdk/azure';
import { NextResponse } from 'next/server';
import { APICallError, createIdGenerator, createUIMessageStream, createUIMessageStreamResponse, DeepPartial, ModelMessage, streamObject, UIMessage } from 'ai';

import { quizShowSchema, QuizShowType } from './schema';
import { getDataPart, getMessageText } from '@/utils/UIMessageHelper';
import prompt from './prompt.md';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const generateId = createIdGenerator({ size: 8 });

function convertObjectToModelMessages(messages: UIMessage[]): ModelMessage[] {
  // const result: ModelMessage[] = [];

  const result = messages.map(message => {
    let content = '';

    if (message.role === 'assistant') {
      // const proxy = getDataProxy<QuizShowType>(message);
      // content = JSON.stringify({
      //   actions: proxy.actions,
      //   secret: proxy.secret,
      //   show: proxy.show,
      //   speak: proxy.speak,
      // } as QuizShowType);
      content = JSON.stringify(getDataPart(message, 'data-quiz'));
    } else {
      content = getMessageText(message);
    }

    return { content: content || '', role: message.role } as ModelMessage;
  });

  return result;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    // const result = generateObject({
    //   model: azure('gpt-4.1'),
    //   temperature: 0.95,
    //   schema: quizShowSchema,
    //   system: prompt,
    //   messages: convertToModelMessages(messages),
    //   maxRetries: 0,
    // });
    // return (await result).toJsonResponse();
    // const obj = (await result);

    // ---

    const id = generateId();

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const result = streamObject({
          model: azure('gpt-4.1'),
          temperature: 0.95,
          schema: quizShowSchema,
          system: prompt,
          messages: convertObjectToModelMessages(messages),
          maxRetries: 0,
        })

        const stream = result.fullStream;
        let lastObject: DeepPartial<QuizShowType> = {};

        // Hilfsfunktion zum Schreiben, wenn sich ein Wert geändert hat
        // function writeIfChanged(obj: DeepPartial<QuizShowType>, prop: keyof QuizShowType) {
        //   if (Array.isArray(obj[prop])) {
        //     if (JSON.stringify(lastObject[prop]) !== JSON.stringify(obj[prop])) {
        //       writer.write({ type: `data-${prop}`, id, data: obj[prop] });
        //     }
        //   } else {
        //     if (lastObject[prop] !== obj[prop]) {
        //       writer.write({ type: `data-${prop}`, id, data: obj[prop] });
        //     }
        //   }
        // }

        writer.write({ type: 'text-start', id });
        for await (const chunk of stream) {

          if (chunk.type === 'object') {
            // only write changed properties - not the whole object
            // writeIfChanged(chunk.object, 'secret');
            // writeIfChanged(chunk.object, 'show');
            // writeIfChanged(chunk.object, 'speak');
            // writeIfChanged(chunk.object, 'actions');

            if (lastObject.speak !== chunk.object.speak) {
              writer.write({
                type: 'text-delta', id,
                delta: chunk.object.speak?.replace(lastObject.speak || '', '') || ''
              });
            }
            lastObject = chunk.object;
          }

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
        const obj = await result.object;
        writer.write({ type: 'data-quiz', id, data: obj })
        // writer.write({ type: `data-speak`, id, data: obj.speak });
        // writer.write({ type: `data-secret`, id, data: obj.secret });
        // writer.write({ type: `data-show`, id, data: obj.show });
        // writer.write({ type: `data-actions`, id, data: obj.actions });
      },
      originalMessages: messages
    })
    return createUIMessageStreamResponse({ stream })

  } catch (error) {
    if (APICallError.isInstance(error)) {
      return NextResponse.json(error.message, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
