'use client';
import { useChat } from '@ai-sdk/react';
import { MemoizedMarkdown } from '@/components/memoized-markdown';
import ScrollIntoView from '@/components/ScrollIntoView';
import styles from '../chat/chat.module.css';

export default function ChatTTS() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    // Throttle the messages and data updates to 50ms:
    experimental_throttle: 50,
  });

  return (
    <div className={styles.container}>
      {messages.map(message => (
        <div key={message.id} className={styles.message}>
          <div className={styles.roleLabel}>
            {message.role === 'user' ? 'User' : 'AI'}
          </div>
          <div className={styles.markdownContent}>
            <MemoizedMarkdown id={message.id} content={message.content} />
          </div>
        </div>
      ))}
      <ScrollIntoView trigger={messages.length} />
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}