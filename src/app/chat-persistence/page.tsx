'use client';

import { useChat } from '@ai-sdk/react';
import { useCallback } from 'react';
import { BsMagic } from "react-icons/bs";

import buttonStyles from '../../css/buttonStyles.module.css';
import styles from './styles.module.css';
import ChatInput from '@/components/ChatInput/ChatInput';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';
import { useChatMessagesPersistence } from '@/hooks/useChatMessagesPersistence';
import { useChatLog } from '@/hooks/useChatLog';
import ChatLog from '@/components/ChatLog/ChatLog';
import BackgroundPattern from '@/components/BackgroundPattern/BackgroundPattern';

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
      <BackgroundPattern styleName='basic-grid'></BackgroundPattern>
      <h1 className={styles.header}>MyGPT</h1>
      <div className={styles.container}>
        <div className={styles.left}>
          <ChatLog {...{ chatLogs, selectedChatLogId, onSelect: setSelectedChatLogId, onRename: renameChatLog, onDelete, onAdd: addChatLog }} />
        </div>
        <div className={styles.right}>
          {selectedChatLogId && (
            <>
              <ChatMessages style="whatsapp" {...{ typing, messages, error, reload, stop }} />
              <ChatInput onSubmit={handleSubmit} showVoiceInput={true} />
            </>
          ) || (
              <div className={styles.noActiveChat}>
                <button type="button" onClick={addChatLog} className={buttonStyles.iconButton}>
                  <BsMagic />&nbsp;Start your first chat
                </button>
              </div>
            )}
        </div>
      </div>
      <SpeechOptions text={lastMessage?.content} />
    </>
  );
}
