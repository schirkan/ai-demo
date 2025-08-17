'use client';
import { useChat } from '@ai-sdk/react';
import { useCallback } from 'react';
import styles from './styles.module.css';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import ChatInput from '@/components/ChatInput/ChatInput';

export default function Chat() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat({ experimental_throttle: 50 });
  const loading = status === 'submitted' || status === 'streaming';

  const handleSubmit = useCallback((text: string) => {
    sendMessage({ role: 'user', parts: [{ type: 'text', text: text }] });
  }, [sendMessage]);

  return (
    <div className={styles.container}>
      <ChatMessages
        messages={messages}
        loading={loading}
        stop={stop}
        error={error}
        regenerate={regenerate} />
      <ChatInput
        onSubmit={handleSubmit}
        loading={loading}
        stop={stop} />
    </div>
  );
}