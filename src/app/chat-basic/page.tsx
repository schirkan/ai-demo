'use client';
import { useChat } from '@ai-sdk/react';
import styles from './styles.module.css';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import ChatInput from '@/components/ChatInput/ChatInput';

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
      <ChatMessages
        messages={messages}
        style='whatsapp'
        typing={status === 'submitted' || status === 'streaming'}
      />
      <ChatInput
        onSubmit={handleSubmit}
        placeholder="Type your message..."
        input={input}
        setInput={setInput}
      />
    </div>
  );
}