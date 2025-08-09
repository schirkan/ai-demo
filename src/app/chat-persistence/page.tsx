'use client';

import { useChat } from '@ai-sdk/react';
import { useCallback } from 'react';

import styles from './styles.module.css';
import ChatInput from '@/components/ChatInput/ChatInput';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';
import { useChatMessagesPersistence } from '@/hooks/useChatMessagesPersistence';
import { useChatLog } from '@/hooks/useChatLog';
import ChatLogUi from '@/components/ChatLogUi/ChatLogUi';

export default function Chat() {
  const { selectedChatLogId, addChatLog, chatLogs, deleteChatLog, renameChatLog, setSelectedChatLogId } = useChatLog({
    storageKey: 'persistence-demo'
  });

  const { messages, setMessages, append, status, error, reload, stop } = useChat({
    experimental_throttle: 50,
    api: '/api/chat',
  });

  const { deleteMessages } = useChatMessagesPersistence({
    storageKey: selectedChatLogId ?? '',
    status,
    messages,
    setMessages,
  });

  const typing = status === 'submitted' || status === 'streaming';
  const lastMessage = status === 'ready' ? messages.findLast(x => x.role === 'assistant') : null;

  const handleSubmit = useCallback((text: string) => {
    append({ content: text, role: 'user' });
  }, [append]);

  const onDelete = useCallback((id: string) => {
    deleteMessages(id);
    deleteChatLog(id);
  }, [deleteChatLog, deleteMessages]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <ChatLogUi {...{ chatLogs, selectedChatLogId, onSelect: setSelectedChatLogId, onRename: renameChatLog, onDelete, onAdd: addChatLog }} />
        </div>
        <div className={styles.right}>
          <ChatMessages style="whatsapp" {...{ typing, messages, error, reload, stop }} />
          <ChatInput onSubmit={handleSubmit} showVoiceInput={true} />
        </div>
      </div>
      <SpeechOptions text={lastMessage?.content} />
    </>
  );
}
