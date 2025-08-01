'use client';
import { useChat } from '@ai-sdk/react';
import { useCallback, useState } from 'react';
import styles from './styles.module.css';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import ChatInput from '@/components/ChatInput/ChatInput';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';

const agents = ['Generic Chatbot', 'DungeonsAndDragons', 'GameMaster', 'InformationGathering', 'PromptOptimization'];

export default function Chat() {
  const [agent, setAgent] = useState('Generic Chatbot');
  const { messages, append, status } = useChat({ experimental_throttle: 50, api: '/api/agent?agent=' + agent });
  const loading = status === 'submitted' || status === 'streaming';
  const lastMessage = status === 'ready' ? messages.findLast(x => x.role === 'assistant') : null;

  const handleSubmit = useCallback((text: string) => {
    append({ content: text, role: 'user' });
  }, [append]);

  return (
    <div className={styles.container}>
      <div className={styles.agentSelection}>
        <label htmlFor="agent-select" style={{ marginRight: '0.5rem' }}>Agent auswählen:</label><br />
        <select id="agent-select" value={agent} onChange={e => setAgent(e.target.value)}>
          {agents.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      <ChatMessages messages={messages} style='whatsapp' typing={loading} />
      <ChatInput onSubmit={handleSubmit} showVoiceInput={true} />
      <SpeechOptions text={lastMessage?.content} />
    </div>
  );
}