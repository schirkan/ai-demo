'use client';
import { useChat } from '@ai-sdk/react';
import { MemoizedMarkdown } from '@/components/MemoizedMarkdown/MemoizedMarkdown';
import styles from './styles.module.css';
import { DefaultChatTransport, UIMessage } from 'ai';
import { QuizShowType } from '@/app/api/quizshow/schema';
import ChatInput from '@/components/ChatInput/ChatInput';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';
import { useState, useCallback } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import BackgroundPattern from '@/components/BackgroundPattern/BackgroundPattern';
import { getDataPart, getMessageText } from '@/utils/UIMessageHelper';

const getObject = (message?: UIMessage): QuizShowType | undefined => {
  return message ? getDataPart<QuizShowType>(message, 'data-quiz') : undefined;
  // return message ? getDataProxy<QuizShowType>(message) : undefined;
};

const mapMessage = (message: UIMessage): UIMessage => {
  if (message.role === 'assistant') {
    const text = getMessageText(message);
    // const text = getDataPart<string>(message, 'data-speak') || '';
    // const text = getObject(message)?.speak || '';
    return { ...message, parts: [{ type: 'text', text: text }] };
  } else {
    return message;
  }
}

export default function Game() {
  const [showSecret, setShowSecret] = useState(false);
  const { messages, sendMessage, status, error, regenerate, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/quizshow' }),
    experimental_throttle: 100
  });

  const loading = status === 'submitted' || status === 'streaming';
  const lastMessage: UIMessage | undefined = messages.findLast(x => x.role === 'assistant' && x.parts.some(x => x.type === 'data-quiz'));
  const response: QuizShowType | undefined = getObject(lastMessage);
  const actions: string[] = messages.length === 0 ? ['Start'] : response?.actions || [];

  const handleSubmit = useCallback((text: string) => {
    sendMessage({ role: 'user', parts: [{ type: 'text', text: text }] });
  }, [sendMessage]);

  return (
    <>
      <BackgroundPattern styleName='blueprint' />
      <h1 className={styles.header}>Quizshow</h1>
      <div className={styles.container}>
        <div className={styles.left}>
          <SpeechOptions text={response?.speak || ''} />
          <div className={styles.show}>
            <MemoizedMarkdown content={response?.show ?? ''} />
          </div>
          <div className={styles.actionsButtons}>
            {actions.map(action =>
              <button key={action} onClick={() => handleSubmit(action)} disabled={loading}>{action}</button>
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
          <ChatMessages
            messages={messages.map(mapMessage)}
            style='ios'
            loading={loading}
            error={error}
            regenerate={regenerate} />
          <ChatInput
            onSubmit={handleSubmit}
            showVoiceInput={true}
            loading={loading}
            stop={stop} />
        </div>
      </div>
    </>
  );
}