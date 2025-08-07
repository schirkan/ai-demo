import { Message } from '@ai-sdk/react';
import { useCallback, useEffect } from 'react';
import { useLatest } from 'react-use';

// Hook für Nachrichten-Persistenz, jetzt mit loadMessages statt initialMessages
export function useChatMessagesPersistence(storageKey: string, status: string, messages: Message[], setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void) {
  const latestMessages = useLatest(messages);

  // Nachrichten aus localStorage laden (nur clientseitig aufrufbar)
  const loadMessages = useCallback((): Message[] => {
    // if (typeof window === "undefined") return [];
    const key = `chat-messages-${storageKey}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Fehler beim Parsen ignorieren
      }
    }
    return [];
  }, [storageKey]);

  // Nachrichten speichern
  const saveMessages = useCallback((messages: Message[]) => {
    console.log("saveMessages", storageKey, messages);
    // if (typeof window === "undefined") return;
    const key = `chat-messages-${storageKey}`;
    localStorage.setItem(key, JSON.stringify(messages));
  }, [storageKey]);

  // Nachrichten löschen
  const clearMessages = useCallback(() => {
    console.log("clearMessages", storageKey);
    // if (typeof window === "undefined") return;
    const key = `chat-messages-${storageKey}`;
    localStorage.removeItem(key);
    setMessages([]);
  }, [storageKey, setMessages]);

  // Nachrichten nach dem Mounten aus dem localStorage laden
  // und nur, wenn noch keine Nachrichten vorhanden sind
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length > 0 && messages.length === 0) {
      setMessages(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (status === 'ready' && latestMessages.current.length) {
      saveMessages(latestMessages.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return {
    clearMessages,
  };
}
