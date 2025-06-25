'use client';
import { useChat } from '@ai-sdk/react';
import styles from './styles.module.css';
import ChatUI from '@/components/ChatUI/ChatUI';

export default function Chat() {
  const { messages, input, setInput, append, status } = useChat({
    experimental_throttle: 50
  });

  const handleSubmit = (text: string) => {
    append({ content: text, role: 'user' });
    setInput('');
  }

  return (
    <div className={styles.container}>
      <ChatUI
        onSubmit={handleSubmit}
        messages={messages}
        input={input}
        style='bubbles'
        setInput={setInput}
        typing={status === 'submitted' || status === 'streaming'}
        placeholder="Type your message..." />
    </div>
  );
}