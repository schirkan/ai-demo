'use client';
import { useChat } from '@ai-sdk/react';
import styles from './chat.module.css';
import ChatUI from '@/components/ChatUI/ChatUI';

export default function Chat() {
  const { messages, input, setInput, append } = useChat();

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
        placeholder="Type your message..." />
    </div>
  );
}