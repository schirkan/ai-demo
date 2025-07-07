import { createAzure } from '@ai-sdk/azure';
import { experimental_generateImage as generateImage } from 'ai';
import { NextResponse } from 'next/server';

const azure = createAzure({
  resourceName: process.env.AZURE_RESOURCE_NAME_DALL_E_3,
  apiKey: process.env.AZURE_API_KEY_DALL_E_3,
});

export async function POST(req: Request, ): Promise<Response> {
  const { prompt } = await req.json();
  const { image } = await generateImage({
    model: azure.imageModel('dall-e-3'),
    prompt: prompt,
    size: '1024x1024', // '1024x1024', '1792x1024', or '1024x1792' for DALL-E 3
    providerOptions: {
      // openai: { style: 'vivid', quality: 'hd' },
      openai: { quality: 'hd' },
    },
  });
  return NextResponse.json({ image: image.base64 });
}
