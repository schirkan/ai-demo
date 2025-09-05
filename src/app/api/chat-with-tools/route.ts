import { APICallError, streamText, convertToModelMessages, UIMessage } from 'ai';
import { NextResponse } from 'next/server';
import { azure } from '@ai-sdk/azure';
import { generateImageTool } from '../tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const modelMessages = convertToModelMessages(messages);

    // remove tool output from model messsages to save tokens
    // modelMessages.filter(x => x.role === 'tool').forEach(x => {
    //   x.content[0].output = { type: 'text', value: '' };
    // });

    const result = await streamText({
      model: azure('gpt-4.1'),
      system: `Du bist ein hilfsbereiter Chatbot.`,
      messages: modelMessages,
      tools: { generateImage: generateImageTool },
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (APICallError.isInstance(error)) {
      return NextResponse.json(error.message, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
