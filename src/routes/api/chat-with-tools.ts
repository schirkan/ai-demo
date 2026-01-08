import { createFileRoute } from '@tanstack/react-router';
import { azure } from '@ai-sdk/azure';
import { APICallError, convertToModelMessages, streamText } from 'ai';
import { generateImageTool } from './tools';
import type { UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const Route = createFileRoute('/api/chat-with-tools')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { messages }: { messages: Array<UIMessage> } = await request.json();

          const modelMessages = await convertToModelMessages(messages);

          // remove tool output from model messages to save tokens (optional)
          // modelMessages.filter(x => x.role === 'tool').forEach(x => {
          //   x.content[0].output = { type: 'text', value: '' };
          // });

          const result = streamText({
            model: azure('gpt-4.1'),
            system: `Du bist ein hilfsbereiter Chatbot.`,
            messages: modelMessages,
            tools: { generateImage: generateImageTool },
          });

          return result.toUIMessageStreamResponse();
        } catch (error) {
          if (APICallError.isInstance(error)) {
            return Response.json({ error: error.message }, { status: error.statusCode });
          }
          return Response.json({ error: 'Unknown error' }, { status: 500 });
        }
      },
    },
  },
});
