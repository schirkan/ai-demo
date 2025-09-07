'use client';

import { useChat } from '@ai-sdk/react';
import { useCallback, useState } from 'react';

import styles from './styles.module.css';
import ChatInput from '@/components/ChatInput/ChatInput';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';
import { getMessageText } from '@/utils/UIMessageHelper';
import { DefaultChatTransport } from 'ai';

const gpts = ['Generic Chatbot', 'DungeonsAndDragons', 'GameMaster', 'InformationGathering', 'PromptOptimization'];

export default function Chat() {
  const [currentGpt, setCurrentGpt] = useState('Generic Chatbot');
  const { messages, sendMessage, status, error, regenerate, stop } = useChat({
    experimental_throttle: 50,
    transport: new DefaultChatTransport({ api: '/api/custom-gpt?id=' + currentGpt }),
    id: currentGpt
  });

  const loading = status === 'submitted' || status === 'streaming';
  const lastMessage = status === 'ready' ? messages.findLast(x => x.role === 'assistant') : null;

  const handleSubmit = useCallback((text: string) => {
    sendMessage({ role: 'user', parts: [{ type: 'text', text: text }] });
  }, [sendMessage]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.agentSelection}>
          <label htmlFor="gpt-select" style={{ marginRight: '0.5rem' }}>GPT auswählen:</label><br />
          <select id="gpt-select" value={currentGpt} onChange={e => setCurrentGpt(e.target.value)}>
            {gpts.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <ChatMessages messages={messages} style='whatsapp' loading={loading} error={error} regenerate={regenerate} />
        <ChatInput onSubmit={handleSubmit} showVoiceInput={true} loading={loading} stop={stop} />
      </div>
      <SpeechOptions text={getMessageText(lastMessage)} />
    </>
  );
}
