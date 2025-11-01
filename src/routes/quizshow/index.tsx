'use client';

import { useCallback, useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { createFileRoute } from '@tanstack/react-router';

import styles from './styles.module.css';
import type { UIMessage } from 'ai';
import type { QuizShowType } from '@/data/quizshow/schema';
import { MemoizedMarkdown } from '@/components/MemoizedMarkdown/MemoizedMarkdown';
import ChatInput from '@/components/ChatInput/ChatInput';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';
import BackgroundPattern from '@/components/BackgroundPattern/BackgroundPattern';
import { getDataPart } from '@/utils/UIMessageHelper';

export const Route = createFileRoute('/quizshow/')({
  component: Page,
});

export default function Page() {
  const [showSecret, setShowSecret] = useState(false);
  const { messages, sendMessage, status, error, regenerate, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/quizshow' }),
    experimental_throttle: 100,
  });

  const loading = status === 'submitted' || status === 'streaming';
  const lastMessage: UIMessage | undefined = messages
    .slice()
    .reverse()
    .find((x: any) => x.role === 'assistant' && x.parts.some((p: any) => p.type === 'data-quiz'));
  const response: QuizShowType | undefined = getDataPart<QuizShowType>(lastMessage, 'data-quiz');
  const actions: Array<string> = messages.length === 0 ? ['Start'] : response?.actions || [];

  const handleSubmit = useCallback(
    (text: string) => {
      sendMessage({ role: 'user', parts: [{ type: 'text', text: text }] });
    },
    [sendMessage],
  );

  return (
    <>
      <BackgroundPattern styleName="blueprint" />
      <h1 className={styles.header}>Quizshow</h1>
      <div className={styles.container}>
        <div className={styles.left}>
          <SpeechOptions text={response?.speak || ''} />
          <div className={styles.show}>
            <MemoizedMarkdown content={response?.show ?? ''} />
          </div>
          <div className={styles.actionsButtons}>
            {actions.map((action) => (
              <button key={action} onClick={() => handleSubmit(action)} disabled={loading}>
                {action}
              </button>
            ))}
          </div>
          <div className={styles.secret}>
            <h2 onClick={() => setShowSecret((value) => !value)}>
              Secret {showSecret ? <BsEye /> : <BsEyeSlash />}
            </h2>
            <div style={{ visibility: showSecret ? 'initial' : 'hidden' }}>{response?.secret}</div>
          </div>
        </div>
        <div className={styles.right}>
          <ChatMessages messages={messages} style="ios" loading={loading} error={error} regenerate={regenerate} />
          <ChatInput style="combined" onSubmit={handleSubmit} showVoiceInput={true} loading={loading} stop={stop} />
        </div>
      </div>
    </>
  );
}
