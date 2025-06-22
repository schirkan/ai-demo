'use client';
import { useChat } from '@ai-sdk/react';
import { MemoizedMarkdown, MemoizedMarkdownBlock } from '@/components/memoized-markdown';
import styles from './page.module.css';
import { UIMessage, } from 'ai';
import { QuizShowType } from '../../../schemas/quizShowSchema';

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
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: '/api/game/familienduell',
    streamProtocol: 'text',
  });

  const lastMessage: UIMessage | undefined = messages.findLast(x => x.role === 'assistant');
  const response: QuizShowType | null = lastMessage ? getObject(lastMessage) : null;
  const actions: string[] = response?.actions || (lastMessage ? [] : ['Start']);

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
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input value={input} placeholder="Say something..." onChange={handleInputChange} />
        </form>
      </div>
    </div>
  );
}