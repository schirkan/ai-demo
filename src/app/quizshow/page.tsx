'use client';
import { useChat } from '@ai-sdk/react';
import { MemoizedMarkdown } from '@/components/MemoizedMarkdown/MemoizedMarkdown';
import styles from './styles.module.css';
import { UIMessage, } from 'ai';
import { QuizShowType } from '@/app/api/quizshow/schema';
import ChatInput from '@/components/ChatInput/ChatInput';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';
import { useState, useCallback } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import BackgroundPattern from '@/components/BackgroundPattern/BackgroundPattern';

const getObject = (message: UIMessage): QuizShowType => {
  const text = message.parts[0].type === 'text' && message.parts[0].text || '{}';
  const response: QuizShowType = JSON.parse(text);
  return response;
};

const mapMessage = (message: UIMessage): UIMessage => {
  const content = message.role === 'assistant' ? getObject(message).speak : message.content;
  return { ...message, content };
}

export default function Game() {
  const [showSecret, setShowSecret] = useState(false);
  const { messages, append, status, error, reload, stop } = useChat({ api: '/api/quizshow', streamProtocol: 'text' });

  const loading = status === 'submitted' || status === 'streaming';
  const lastMessage: UIMessage | undefined = messages.findLast(x => x.role === 'assistant');
  const response: QuizShowType | null = lastMessage ? getObject(lastMessage) : null;
  const actions: string[] = response?.actions || ['Start'];

  const handleSubmit = useCallback((text: string) => {
    append({ content: text, role: 'user' });
  }, [append]);

  return (
    <>
      <BackgroundPattern styleName='blueprint' />
      <h1 className={styles.header}>Quizshow</h1>
      <div className={styles.container}>
        <div className={styles.left}>
          <SpeechOptions text={response?.speak} />
          <div className={styles.show}>
            <MemoizedMarkdown content={response?.show ?? ''} />
          </div>
          <div className={styles.actionsButtons}>
            {actions.map(action =>
              <button key={action} onClick={() => append({ content: action, role: 'user' })}>{action}</button>
            )}
          </div>
          <div className={styles.secret}>
            <h2 onClick={() => setShowSecret(value => !value)}>
              Secret {showSecret ? <BsEye /> : <BsEyeSlash />}
            </h2>
            <div style={{ visibility: showSecret ? 'initial' : 'hidden' }}>{response?.secret}</div>
          </div>
        </div>
        <div className={styles.right}>
          <ChatMessages messages={messages.map(mapMessage)} style='ios' typing={loading} error={error} reload={reload} stop={stop} />
          <ChatInput onSubmit={handleSubmit} disabled={loading} showVoiceInput={true} />
        </div>
      </div>
    </>
  );
}