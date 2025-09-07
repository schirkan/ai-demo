import { azure } from '@ai-sdk/azure';
import { APICallError, convertToModelMessages, streamText, UIMessage } from 'ai';
import { NextResponse } from 'next/server';

import promptDungeonsAndDragons from './DungeonsAndDragons.md';
import promptGameMaster from './GameMaster.md';
import promptInformationGathering from './InformationGathering.md';
import promptPromptOptimization from './PromptOptimization.md';

const agents: { [key: string]: string } = {
  'DungeonsAndDragons': promptDungeonsAndDragons,
  'GameMaster': promptGameMaster,
  'InformationGathering': promptInformationGathering,
  'PromptOptimization': promptPromptOptimization,
};

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || '';
    const systemPrompt = agents[id] || 'Du bist ein hilfsbereiter Chatbot.';
    const { messages }: { messages: UIMessage[] } = await req.json();
    const result = streamText({
      model: azure('gpt-4.1'),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (APICallError.isInstance(error)) {
      return NextResponse.json(error.message, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
