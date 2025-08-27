'use client';

import { useChat } from '@ai-sdk/react';
import { useCallback, useEffect } from 'react';
import { BsMagic } from "react-icons/bs";

import buttonStyles from '../../css/buttonStyles.module.css';
import styles from './styles.module.css';
import ChatInput from '@/components/ChatInput/ChatInput';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';
import ChatLog from '@/components/ChatLog/ChatLog';
import BackgroundPattern from '@/components/BackgroundPattern/BackgroundPattern';
import { useChatMessagesPersistence } from '@/hooks/useChatMessagesPersistence';
import { useChatLog } from '@/hooks/useChatLog';
import { useAutoGenerateTitle } from '@/hooks/useAutoGenerateTitle';
import { getMessageText } from '@/utils/UIMessageHelper';
import { DefaultChatTransport } from 'ai';

export default function Chat() {
  const { selectedChatLogId, addChatLog, chatLogs, deleteChatLog, renameChatLog, setSelectedChatLogId } = useChatLog({
    storageKey: 'persistence-demo'
  });
  const { messages, setMessages, sendMessage, status, error, regenerate, stop } = useChat({
    experimental_throttle: 50,
    transport: new DefaultChatTransport({ api: '/api/chat-with-tools' }),
  });
  const { deleteMessages } = useChatMessagesPersistence({
    storageKey: selectedChatLogId ?? '', status, messages, setMessages
  });
  const { generateTitle } = useAutoGenerateTitle();

  const loading = status === 'submitted' || status === 'streaming';
  const lastMessage = status === 'ready' ? messages.findLast(x => x.role === 'assistant') : null;

  useEffect(() => {
    if (messages.length === 1 && selectedChatLogId) {
      const content = getMessageText(messages[0]);
      generateTitle(content).then(newTitle => renameChatLog(selectedChatLogId, newTitle));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleSubmit = useCallback((text: string) => {
    sendMessage({ role: 'user', parts: [{ type: 'text', text: text }] });
  }, [sendMessage]);

  const onDelete = useCallback((id: string) => {
    deleteMessages(id);
    deleteChatLog(id);
  }, [deleteChatLog, deleteMessages]);

  return (
    <>
      <BackgroundPattern styleName='blueprint' />
      <h1 className={styles.header}>MyGPT</h1>
      <div className={styles.container}>
        <div className={styles.left}>
          <ChatLog {...{ chatLogs, selectedChatLogId, onSelect: setSelectedChatLogId, onRename: renameChatLog, onDelete, onAdd: addChatLog }} />
        </div>
        <div className={styles.right}>
          {selectedChatLogId && (
            <>
              <ChatMessages
                style='whatsapp'
                messages={messages}
                loading={loading}
                error={error}
                regenerate={regenerate} />
              <ChatInput
                style='combined'
                onSubmit={handleSubmit}
                showVoiceInput={true}
                loading={loading}
                stop={stop} />
            </>
          ) || (
              <div className={styles.noActiveChat}>
                <button type="button" onClick={addChatLog} className={buttonStyles.iconButton}>
                  <BsMagic />&nbsp;Start your first chat
                </button>
              </div>
            )}
        </div>
        <SpeechOptions text={getMessageText(lastMessage)} position='bottom-left' />
      </div>
    </>
  );
}
