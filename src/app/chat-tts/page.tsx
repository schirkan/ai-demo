'use client';
import { useChat } from '@ai-sdk/react';
import styles from './styles.module.css';
import ChatUI from '@/components/ChatUI/ChatUI';
import { useSpeech } from 'react-text-to-speech';

export default function Chat() {
  const { messages, input, setInput, append, status } = useChat({
    experimental_throttle: 50
  });
  const lastMessage = status === 'ready' ? messages.findLast(x => x.role === 'assistant') : null;

  const handleSubmit = (text: string) => {
    append({ content: text, role: 'user' });
    setInput('');
  }

  const { speechStatus } = useSpeech({
    text: lastMessage?.content,
    autoPlay: true,
    lang: 'de-DE',
    voiceURI: 'Microsoft Conrad Online (Natural) - German (Germany)'
  });

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
      {speechStatus === 'started' || speechStatus === 'queued' ? 'Speaking... 📢' : ''}
    </div>
  );
}