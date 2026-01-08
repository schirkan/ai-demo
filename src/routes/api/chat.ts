import { createFileRoute } from '@tanstack/react-router';
import { azure } from '@ai-sdk/azure';
import { APICallError, convertToModelMessages, streamText } from 'ai';
import type { UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { messages }: { messages: Array<UIMessage> } = await request.json();
          const result = streamText({
            model: azure('gpt-4.1'),
            system: `Du bist ein hilfsbereiter Chatbot.`,
            messages: await convertToModelMessages(messages),
          });
          // toUIMessageStreamResponse() returns a Response-like streaming response
          return result.toUIMessageStreamResponse();
        } catch (error) {
          if (APICallError.isInstance(error)) {
            // APICallError contains statusCode and message
            return Response.json({ error: error.message }, { status: error.statusCode });
          }
          return Response.json({ error: 'Unknown error' }, { status: 500 });
        }
      },
    },
  },
});
