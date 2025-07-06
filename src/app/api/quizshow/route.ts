import { azure } from '@ai-sdk/azure';
import { generateObject } from 'ai';
import { quizShowSchema } from '../../../schemas/quizShowSchema';
import prompt from './prompt.md';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = generateObject({
    model: azure('gpt-4.1'),
    temperature: 0.9,
    schema: quizShowSchema,
    system: prompt,
    messages,
  });
  return (await result).toJsonResponse();
}