import { createFileRoute } from '@tanstack/react-router';
import { azure } from '@ai-sdk/azure';
import { APICallError, convertToModelMessages, streamText } from 'ai';

import promptDungeonsAndDragons from '../../data/custom-gpt/DungeonsAndDragons.md?raw';
import promptGameMaster from '../../data/custom-gpt/GameMaster.md?raw';
import promptInformationGathering from '../../data/custom-gpt/InformationGathering.md?raw';
import promptPromptOptimization from '../../data/custom-gpt/PromptOptimization.md?raw';

import type { UIMessage } from 'ai';

const agents: { [key: string]: string } = {
  DungeonsAndDragons: promptDungeonsAndDragons,
  GameMaster: promptGameMaster,
  InformationGathering: promptInformationGathering,
  PromptOptimization: promptPromptOptimization,
};

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const Route = createFileRoute(('/api/custom-gpt'))({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const url = new URL(request.url);
          const id = url.searchParams.get('id') || '';
          const systemPrompt = agents[id] || 'Du bist ein hilfsbereiter Chatbot.';
          const { messages }: { messages: Array<UIMessage> } = await request.json();

          const result = streamText({
            model: azure('gpt-4.1'),
            system: systemPrompt,
            messages: convertToModelMessages(messages),
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
