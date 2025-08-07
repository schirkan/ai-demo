'use client';

import { useChat } from '@ai-sdk/react';
import { BsTrashFill } from 'react-icons/bs';
import { useCallback, useState } from 'react';

import buttonStyles from '../../css/buttonStyles.module.css';
import styles from './styles.module.css';
import ChatInput from '@/components/ChatInput/ChatInput';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';
import { useChatMessagesPersistence } from '@/hooks/useChatMessagesPersistence';

const agents = ['Generic Chatbot', 'DungeonsAndDragons', 'GameMaster', 'InformationGathering', 'PromptOptimization'];

export default function Chat() {
  const [agent, setAgent] = useState('Generic Chatbot');
  const { messages, setMessages, append, status, error, reload, stop } = useChat({ experimental_throttle: 50, api: '/api/agent?agent=' + agent });
  const { clearMessages } = useChatMessagesPersistence(agent, status, messages, setMessages);

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
        <button type="button" onClick={clearMessages} className={buttonStyles.iconButton}>
          <BsTrashFill />
        </button>
      </div>
      <ChatMessages messages={messages} style='whatsapp' typing={loading} error={error} reload={reload} stop={stop} />
      <ChatInput onSubmit={handleSubmit} showVoiceInput={true} />
      <SpeechOptions text={lastMessage?.content} />
    </div>
  );
}
