'use client';
import { useChat } from '@ai-sdk/react';
import { MemoizedMarkdown, MemoizedMarkdownBlock } from '@/components/MemoizedMarkdown/MemoizedMarkdown';
import styles from './page.module.css';
import { UIMessage, } from 'ai';
import { QuizShowType } from '../../../schemas/quizShowSchema';
import ScrollIntoView from '@/components/ScrollIntoView/ScrollIntoView';
import { useSpeech } from 'react-text-to-speech';

const getObject = (message: UIMessage): QuizShowType => {
  const text = message.parts[0].type === 'text' && message.parts[0].text || '{}';
  const response: QuizShowType = JSON.parse(text);
  return response;
};

const renderMessage = (message: UIMessage) => {
  const content = message.role === 'assistant' ? getObject(message).speak : message.content;

  return <div key={message.id} className={styles.message}>
    <div className={styles.roleLabel}>
      {message.role === 'user' ? 'User' : 'AI'}
    </div>
    <div className={styles.markdownContent}>
      <MemoizedMarkdown id={message.id} content={content} />
    </div>
  </div>;
}

export default function Game() {
  const { messages, input, handleInputChange, handleSubmit, append, status } = useChat({
    api: '/api/game/familienduell',
    streamProtocol: 'text',
  });

  const lastMessage: UIMessage | undefined = messages.findLast(x => x.role === 'assistant');
  const response: QuizShowType | null = lastMessage ? getObject(lastMessage) : null;
  const actions: string[] = response?.actions || (lastMessage ? [] : ['Start']);

  const { speechStatus } = useSpeech({
    text: response?.speak,
    autoPlay: true,
    lang: 'de-DE',
    voiceURI: 'Microsoft Conrad Online (Natural) - German (Germany)'
  });

  let statusIndicator = '';

  switch (status) {
    case 'error':
      statusIndicator = 'Error! ❌';
      break;
    case 'ready':
      statusIndicator =
        (speechStatus === 'started' || speechStatus === 'queued')
          ? 'Speaking... 📢'
          : '';
      break;
    case 'streaming':
    default:
      statusIndicator = 'AI is thinking... 🤖';
      break;
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <MemoizedMarkdownBlock content={response?.show ?? ''} />

        <div className={styles.callForAction}>
          <div>{response?.callForAction}</div>
          <div className='actions-buttons'>
            {actions.map(action => <button key={action} onClick={() => append({ content: action, role: 'user' })}>{action}</button>)}
          </div>
        </div>

      </div>

      <div className={styles.chat}>
        {messages.map(renderMessage)}
        <div>{statusIndicator}</div>
        <ScrollIntoView trigger={messages.length} />
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input value={input} placeholder="Say something..." onChange={handleInputChange} />
        </form>
      </div>
    </div>
  );
}