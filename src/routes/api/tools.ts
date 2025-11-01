import { experimental_generateImage, tool } from 'ai';
import { createAzure } from '@ai-sdk/azure';
import { z } from 'zod';
import { imgbbUploader } from 'imgbb-uploader';
import type { JSONValue } from 'ai';

const dalle = createAzure({
  resourceName: process.env.AZURE_RESOURCE_NAME_DALL_E_3,
  apiKey: process.env.AZURE_API_KEY_DALL_E_3,
});

const generateImageSchema = z.object({
  prompt: z.string().describe('Bildbeschreibung'),
  hdQuality: z.boolean().optional().describe("HD Bildqualität (dauert länger)"),
  style: z.string().optional().describe("Bildstil ('natural' or 'vivid')"),
  seed: z.number().optional().describe('Seed für die Generierung'),
});

export const generateImage = async ({ prompt, hdQuality, style, seed }: z.infer<typeof generateImageSchema>) => {
  const options = {} as Record<string, JSONValue>;
  if (style) options.style = style;
  if (hdQuality) options.quality = 'hd';
  const { image } = await experimental_generateImage({
    model: dalle.imageModel('dall-e-3'),
    prompt,
    seed,
    size: '1024x1024',
    providerOptions: { openai: options },
  });
  // return { url: "data:" + image.mediaType + ";base64," + image.base64, mediaType: image.mediaType };

  const uploadResponse = await imgbbUploader({
    apiKey: process.env.IMGBB_API_KEY, // MANDATORY
    // name: "yourCustomFilename", // OPTIONAL: pass a custom filename to imgBB API
    expiration: 30 * 24 * 60 * 60, // OPTIONAL: pass a numeric value in seconds. It must be in the 60-15552000 range. Enable this to force your image to be deleted after that time.
    base64string: image.base64,
  });

  return { url: uploadResponse.url, mediaType: image.mediaType } // todo: save other output fields
};

export const generateImageTool = tool({
  description: 'Generiert ein Bild basierend auf einer Beschreibung.',
  inputSchema: generateImageSchema,
  execute: generateImage,
});