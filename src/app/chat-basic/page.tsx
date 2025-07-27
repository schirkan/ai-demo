'use client';
import { useChat } from '@ai-sdk/react';
import { useCallback } from 'react';
import styles from './styles.module.css';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import ChatInput from '@/components/ChatInput/ChatInput';

export default function Chat() {
  const { messages, append, status } = useChat({ experimental_throttle: 50 });
  const loading = status === 'submitted' || status === 'streaming';

  const handleSubmit = useCallback((text: string) => {
    append({ content: text, role: 'user' });
  }, [append]);

  return (
    <div className={styles.container}>
      <ChatMessages messages={messages} />
      <ChatInput onSubmit={handleSubmit} disabled={loading} />
    </div>
  );
}