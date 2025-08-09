import { useCallback, useEffect, useState } from 'react';
import { useLatest } from 'react-use';

export interface ChatLogMeta {
  id: string;
  title: string;
  createdAt: string;
}

const CHAT_LOGS_KEY = 'chat-logs';
const SELECTED_CHAT_LOG_ID_KEY = 'selected-chat-log-id';

function loadChatLogs(props: Required<ChatLogProps>): ChatLogMeta[] {
  const stored = props.storage.getItem(CHAT_LOGS_KEY + '.' + props.storageKey);
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
}

function saveChatLogs(props: Required<ChatLogProps>, logs: ChatLogMeta[]) {
  props.storage.setItem(CHAT_LOGS_KEY + '.' + props.storageKey, JSON.stringify(logs));
}

function loadSelectedChatLogId(props: Required<ChatLogProps>): string | null {
  return props.storage.getItem(SELECTED_CHAT_LOG_ID_KEY + '.' + props.storageKey);
}

function saveSelectedChatLogId(props: Required<ChatLogProps>, id: string | null) {
  if (id) {
    props.storage.setItem(SELECTED_CHAT_LOG_ID_KEY + '.' + props.storageKey, id);
  } else {
    props.storage.removeItem(SELECTED_CHAT_LOG_ID_KEY + '.' + props.storageKey);
  }
}

interface ChatLogProps {
  storageKey: string,
  storage?: Storage
}

export function useChatLog(props: ChatLogProps) {
  props.storage = props.storage || (typeof window !== "undefined" ? localStorage : undefined);
  const latestProps = useLatest(props as Required<ChatLogProps>);

  const [chatLogs, setChatLogs] = useState<ChatLogMeta[]>([]);
  const [selectedChatLogId, setSelectedChatLogId] = useState<string | null>(null);

  // Initial laden
  useEffect(() => {
    setChatLogs(loadChatLogs(latestProps.current));
    setSelectedChatLogId(loadSelectedChatLogId(latestProps.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speichern, wenn sich chatLogs ändern
  useEffect(() => {
    saveChatLogs(latestProps.current, chatLogs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatLogs]);

  // Speichern, wenn sich selectedChatLogId ändert
  useEffect(() => {
    saveSelectedChatLogId(latestProps.current, selectedChatLogId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatLogId]);

  return {
    chatLogs,
    selectedChatLogId,
    setSelectedChatLogId,
    addChatLog: useCallback(() => {
      const newLog: ChatLogMeta = {
        id: crypto.randomUUID(),
        title: 'new chat',
        createdAt: new Date().toISOString(),
      };
      setChatLogs((prev) => [newLog, ...prev]);
      setSelectedChatLogId(newLog.id);
      return newLog.id;
    }, []),
    deleteChatLog: useCallback((id: string) => {
      setChatLogs((prev) => prev.filter((log) => log.id !== id));
      setSelectedChatLogId((prev) => (prev === id ? null : prev));
    }, []),
    renameChatLog: useCallback((id: string, newTitle: string) => {
      setChatLogs((prev) =>
        prev.map((log) =>
          log.id === id
            ? { ...log, title: newTitle }
            : log
        )
      );
    }, []),
  };
}
