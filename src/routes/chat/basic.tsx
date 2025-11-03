'use client';
import { useChat } from '@ai-sdk/react';
import { useCallback } from 'react';

import { createFileRoute } from '@tanstack/react-router'
import styles from './basic.module.css';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import ChatInput from '@/components/ChatInput/ChatInput';

export const Route = createFileRoute('/chat/basic')({
  component: Page,
})

export default function Page() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat({ experimental_throttle: 100 });
  const loading = status === 'submitted' || status === 'streaming';

  const handleSubmit = useCallback((text: string) => {
    sendMessage({ role: 'user', parts: [{ type: 'text', text: text }] });
  }, [sendMessage]);

  return (
    <div className={styles.container}>
      <ChatMessages
        messages={messages}
        loading={loading}
        error={error}
        regenerate={regenerate} />
      <ChatInput
        onSubmit={handleSubmit}
        loading={loading}
        stop={stop} />
    </div>
  );
}
