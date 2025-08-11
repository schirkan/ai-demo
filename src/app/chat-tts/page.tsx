'use client';
import { useChat } from '@ai-sdk/react';
import { useCallback } from 'react';
import styles from './styles.module.css';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import ChatInput from '@/components/ChatInput/ChatInput';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';

export default function Chat() {
  const { messages, append, status, error, reload, stop } = useChat({ experimental_throttle: 50 });
  const loading = status === 'submitted' || status === 'streaming';
  const lastMessage = status === 'ready' ? messages.findLast(x => x.role === 'assistant') : null;

  const handleSubmit = useCallback((text: string) => {
    append({ content: text, role: 'user' });
  }, [append]);

  return (
    <>
      <div className={styles.container}>
        <ChatMessages messages={messages} style='whatsapp' typing={loading} error={error} reload={reload} stop={stop} />
        <ChatInput onSubmit={handleSubmit} showVoiceInput={true} />
      </div>
      <SpeechOptions text={lastMessage?.content} />
    </>
  );
}