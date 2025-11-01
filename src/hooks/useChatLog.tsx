import { useCallback, useEffect, useState } from 'react';
import { useLatest } from 'react-use';

export interface ChatLogMeta {
  id: string;
  title: string;
  createdAt: string;
}

const CHAT_LOGS_KEY = 'chat-logs';
const SELECTED_CHAT_LOG_ID_KEY = 'selected-chat-log-id';

function loadChatLogs(props: Required<ChatLogProps>): Array<ChatLogMeta> {
  console.log('loadChatLogs');
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

function saveChatLogs(props: Required<ChatLogProps>, logs: Array<ChatLogMeta>) {
  console.log('saveChatLogs', logs);
  props.storage.setItem(CHAT_LOGS_KEY + '.' + props.storageKey, JSON.stringify(logs));
}

function loadSelectedChatLogId(props: Required<ChatLogProps>): string | null {
  console.log('loadSelectedChatLogId');
  return props.storage.getItem(SELECTED_CHAT_LOG_ID_KEY + '.' + props.storageKey);
}

function saveSelectedChatLogId(props: Required<ChatLogProps>, id: string | null) {
  console.log('saveSelectedChatLogId', id);
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

  const [chatLogs, setChatLogs] = useState<Array<ChatLogMeta>>([]);
  const [selectedChatLogId, setSelectedChatLogId] = useState<string | null>(null);

  // Initial laden
  useEffect(() => {
    const initialChatLog = loadChatLogs(latestProps.current);
    setChatLogs(initialChatLog);
    setSelectedChatLogId(loadSelectedChatLogId(latestProps.current));

    if (initialChatLog.length === 0) {
      addChatLog();
    }
  }, []);

  // Speichern, wenn sich chatLogs ändern
  useEffect(() => {
    saveChatLogs(latestProps.current, chatLogs);
  }, [chatLogs]);

  // Speichern, wenn sich selectedChatLogId ändert
  useEffect(() => {
    saveSelectedChatLogId(latestProps.current, selectedChatLogId);
  }, [selectedChatLogId]);

  const addChatLog = useCallback(() => {
    const newLog: ChatLogMeta = {
      id: crypto.randomUUID(),
      title: 'new chat',
      createdAt: new Date().toISOString(),
    };
    setChatLogs((prev) => [newLog, ...prev]);
    setSelectedChatLogId(newLog.id);
    return newLog.id;
  }, []);

  const deleteChatLog = useCallback((id: string) => {
    let nextId: string | undefined = undefined;
    setChatLogs((prev) => {
      nextId = prev.find((log) => log.id !== id)?.id;
      return prev.filter((log) => log.id !== id);
    });
    setSelectedChatLogId((prev) => (prev === id ? nextId || null : prev));
  }, []);

  const renameChatLog = useCallback((id: string, newTitle: string) => {
    setChatLogs((prev) =>
      prev.map((log) =>
        log.id === id
          ? { ...log, title: newTitle }
          : log
      )
    );
  }, []);

  return {
    chatLogs,
    selectedChatLogId,
    setSelectedChatLogId,
    addChatLog,
    deleteChatLog,
    renameChatLog,
  };
}
