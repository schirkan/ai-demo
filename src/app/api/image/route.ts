import { azure } from '@ai-sdk/azure';
import { experimental_generateImage as generateImage } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const { image } = await generateImage({
    model: azure.imageModel('your-dalle-deployment-name'),
    prompt: messages,
    size: '1024x1024', // '1024x1024', '1792x1024', or '1024x1792' for DALL-E 3
    providerOptions: {
      // openai: { style: 'vivid', quality: 'hd' },
    },
  });
  return image;
}
