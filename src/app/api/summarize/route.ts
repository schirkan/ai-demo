import { azure } from '@ai-sdk/azure';
import { APICallError, generateText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const result = await generateText({
      model: azure('gpt-4.1'),
      system: `Erstelle eine sehr kurze Überschrift (maximal 8 Wörter) für nachfolgende Anfrage.`,
      prompt: text,
    });
    return result.text;
  } catch (error) {
    if (APICallError.isInstance(error)) {
      return NextResponse.json(error.message, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}