import { createAzure } from '@ai-sdk/azure';
import { APICallError, experimental_generateImage as generateImage, JSONValue } from 'ai';
import { NextResponse } from 'next/server';

const azure = createAzure({
  resourceName: process.env.AZURE_RESOURCE_NAME_DALL_E_3,
  apiKey: process.env.AZURE_API_KEY_DALL_E_3,
});

export interface ImageRequest {
  prompt: string,
  quality?: string,
  style?: string,
  seed?: number,
}

export interface ImageResponse {
  url?: string,
  error?: string,
}

export async function POST(req: Request): Promise<Response> {
  const { prompt, quality, style, seed } = await req.json() as ImageRequest;

  try {
    const options = {} as Record<string, JSONValue>;
    if (style) options.style = style;
    if (quality) options.quality = quality;

    const { image } = await generateImage({
      model: azure.imageModel('dall-e-3'),
      prompt: prompt,
      seed: seed,
      size: '1024x1024', // '1024x1024', '1792x1024', or '1024x1792' for DALL-E 3
      providerOptions: { openai: options },
    });
    return NextResponse.json({ url: "data:" + image.mediaType + ";base64," + image.base64 });
  } catch (error) {
    if (APICallError.isInstance(error)) {
      const apiErrorMessage = error.message ||
        (error.data && typeof error.data === 'object' && 'error' in error.data &&
          (error.data as { error?: { message?: string } }).error?.message);
      return NextResponse.json({ error: apiErrorMessage }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
