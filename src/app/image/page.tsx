'use client';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import styles from './styles.module.css';
import ChatInput from '@/components/ChatInput/ChatInput';
import { useState } from 'react';
import { ImageDisplay } from '@/components/ImageDisplay/ImageDisplay';

export default function Chat() {
  const [input, setInput] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { image, error, timing, isLoading, startGeneration, resetState, activePrompt } = useImageGeneration();

  const handleSubmit = (text: string) => {
    startGeneration(text);
    setInput('');
  }

  return (
    <div className={styles.container}>
      <ImageDisplay
        image={image}
        timing={timing}
        failed={!!error}
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