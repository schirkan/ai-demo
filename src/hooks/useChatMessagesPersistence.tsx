import { useEffect, useMemo } from 'react';
import { useLatest } from 'react-use';
import type { UIMessage } from '@ai-sdk/react';

interface ChatMessagesPersistenceProps {
  storageKey: string,
  status: string,
  messages: Array<UIMessage>,
  setMessages: (messages: Array<UIMessage> | ((messages: Array<UIMessage>) => Array<UIMessage>)) => void,
  storage?: Storage
}

// Nachrichten aus Storage laden
const loadMessages = (props: Required<ChatMessagesPersistenceProps>) => {
  const key = `chat-messages-${props.storageKey}`;
  console.log("loadMessages", key);
  const stored = props.storage.getItem(key);
  if (stored) {
    try {
      const messages = JSON.parse(stored);
      if (Array.isArray(messages)) { //  && stored.length > 0 && props.messages.length === 0
        props.setMessages(messages);
        return;
      }
    } catch {
      // Fehler beim Parsen ignorieren
    }
  }
  props.setMessages([]);
};

// Nachrichten speichern
const saveMessages = (props: Required<ChatMessagesPersistenceProps>) => {
  if (props.status === 'ready' && props.messages.length) {
    const key = `chat-messages-${props.storageKey}`;
    console.log("saveMessages", key, props.messages);
    props.storage.setItem(key, JSON.stringify(props.messages));
  }
};

// Nachrichten löschen
const deleteMessages = (props: Required<ChatMessagesPersistenceProps>, storageKey: string | undefined) => {
  const key = `chat-messages-${storageKey || props.storageKey}`;
  console.log("deleteMessages", key);
  props.storage.removeItem(key);
  props.setMessages([]);
};

// Hook für Nachrichten-Persistenz, jetzt mit loadMessages statt initialMessages
export function useChatMessagesPersistence(props: ChatMessagesPersistenceProps) {
  props.storage = props.storage || (typeof window !== "undefined" ? localStorage : undefined);
  const latestProps = useLatest(props as Required<ChatMessagesPersistenceProps>);

  useEffect(() => loadMessages(latestProps.current), [props.storageKey]);

  useEffect(() => saveMessages(latestProps.current), [props.status]);

  return useMemo(() => ({
    deleteMessages: (storageKey?: string) => deleteMessages(latestProps.current, storageKey),
  }), []);
}
