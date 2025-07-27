import { azure } from '@ai-sdk/azure';
import { APICallError, generateObject } from 'ai';
import { quizShowSchema } from './schema';
import prompt from './prompt.md';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const result = generateObject({
      model: azure('gpt-4.1'),
      temperature: 0.95,
      schema: quizShowSchema,
      system: prompt,
      messages,
      maxRetries: 0,
    });
    return (await result).toJsonResponse();
  } catch (error) {
    if (APICallError.isInstance(error)) {
      return NextResponse.json(error.message, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}