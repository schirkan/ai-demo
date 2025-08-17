'use client';
import { useChat } from '@ai-sdk/react';
import { useCallback } from 'react';
import styles from './styles.module.css';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import ChatInput from '@/components/ChatInput/ChatInput';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';
import { getMessageText } from '@/utils/UIMessageHelper';

export default function Chat() {
  const { messages, sendMessage, status, error, regenerate, stop } = useChat({ experimental_throttle: 50 });
  const loading = status === 'submitted' || status === 'streaming';
  const lastMessage = status === 'ready' ? messages.findLast(x => x.role === 'assistant') : null;

  const handleSubmit = useCallback((text: string) => {
    sendMessage({ role: 'user', parts: [{ type: 'text', text: text }] });
  }, [sendMessage]);

  return (
    <>
      <div className={styles.container}>
        <ChatMessages
          messages={messages}
          style='whatsapp'
          loading={loading}
          error={error}
          regenerate={regenerate}
          stop={stop} />
        <ChatInput
          onSubmit={handleSubmit}
          showVoiceInput={true}
          loading={loading}
          stop={stop} />
      </div>
      <SpeechOptions text={getMessageText(lastMessage)} />
    </>
  );
}