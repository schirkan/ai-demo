import { azure } from '@ai-sdk/azure';
import { APICallError, streamText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const result = streamText({
      model: azure('gpt-4.1'),
      system: `Du bist ein hilfsbereiter Chatbot.`,
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