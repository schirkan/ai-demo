import { UIMessage } from "ai";

function isTextPart(part: UIMessage["parts"][number]): part is { type: 'text'; text: string } {
  return part?.type === 'text' && typeof part.text === 'string';
}

export function getMessageText(message: UIMessage | null | undefined): string {
  if (!message) return '';
  return message.parts.filter(isTextPart).map((part) => part.text).join('\n').trim();
}

export function getDataPart<TData>(message: UIMessage | null | undefined, type: string): TData | undefined {
  if (!message) return undefined;
  const dataParts = message.parts.filter(x => x.type === type);
  const firstPart = dataParts[0] as { data: TData };
  return firstPart?.data;
}

export function getDataProxy<TObj>(message: UIMessage): TObj {
  return new Proxy({}, {
    get: (_, prop) => getDataPart(message, 'data-' + prop.toString()),
    set: () => {
      throw Error('Set not supported');
    },
  }) as TObj;
}