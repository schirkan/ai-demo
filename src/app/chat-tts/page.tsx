'use client';
import { useChat } from '@ai-sdk/react';
import styles from './styles.module.css';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import ChatInput from '@/components/ChatInput/ChatInput';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';

export default function Chat() {
  const { messages, input, setInput, append, status } = useChat({
    experimental_throttle: 50
  });
  const lastMessage = status === 'ready' ? messages.findLast(x => x.role === 'assistant') : null;

  const handleSubmit = (text: string) => {
    append({ content: text, role: 'user' });
    setInput('');
  }

  return (
    <div className={styles.container}>
      <ChatMessages
        messages={messages}
        style='bubbles'
        typing={status === 'submitted' || status === 'streaming'}
      />
      <ChatInput
        onSubmit={handleSubmit}
        placeholder="Type your message..."
        input={input}
        setInput={setInput}
        showVoiceInput={true}
      />
      <SpeechOptions text={lastMessage?.content} />
    </div>
  );
}