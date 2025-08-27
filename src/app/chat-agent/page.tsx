'use client';

import { useChat } from '@ai-sdk/react';
import { useCallback, useState } from 'react';

import styles from './styles.module.css';
import ChatInput from '@/components/ChatInput/ChatInput';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';
import { getMessageText } from '@/utils/UIMessageHelper';
import { DefaultChatTransport } from 'ai';

const agents = ['Generic Chatbot', 'DungeonsAndDragons', 'GameMaster', 'InformationGathering', 'PromptOptimization'];

export default function Chat() {
  const [agent, setAgent] = useState('Generic Chatbot');
  const { messages, sendMessage, status, error, regenerate, stop } = useChat({
    experimental_throttle: 50,
    transport: new DefaultChatTransport({ api: '/api/agent?agent=' + agent }),
    id: agent
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
          <label htmlFor="agent-select" style={{ marginRight: '0.5rem' }}>Agent auswählen:</label><br />
          <select id="agent-select" value={agent} onChange={e => setAgent(e.target.value)}>
            {agents.map(a => (
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
