import { azure } from '@ai-sdk/azure';
import { APICallError, streamText } from 'ai';
import promptDungeonsAndDragons from './DungeonsAndDragons.md';
import promptGameMaster from './GameMaster.md';
import promptInformationGathering from './InformationGathering.md';
import promptPromptOptimization from './PromptOptimization.md';
import { NextResponse } from 'next/server';

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
    const agent = searchParams.get('agent') || '';
    const systemPrompt = agents[agent] || 'Du bist ein hilfsbereiter Chatbot.';
    const { messages } = await req.json();
    const result = streamText({
      model: azure('gpt-4.1'),
      system: systemPrompt,
      messages,
    });
    return result.toDataStreamResponse();
  } catch (error) {
    if (APICallError.isInstance(error)) {
      return NextResponse.json(error.message, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}