'use client';
import { MemoizedMarkdown } from '@/components/memoized-markdown';
import ScrollIntoView from '@/components/ScrollIntoView';
import styles from './ChatUI.module.css';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { Message } from 'ai';

export interface ChatUIProps {
  style?: 'default' | 'bubbles' | undefined,
  messages: Message[],
  onSubmit: (text: string) => void,
  placeholder: string,
  input: string,
  setInput: (text: string) => void,
  typing?: boolean,
}

export default function ChatUI(props: ChatUIProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    props.onSubmit(props.input);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event): void => {
    props.setInput(event.target.value);
  };

  return (
    <div className={styles.container} data-style={props.style ?? 'default'}>
      <div className={styles.messages}>
        {props.messages.map(message => (
          <div key={message.id} className={styles.message} data-role={message.role}>
            <div className={styles.roleLabel}>{message.role === 'user' ? 'User' : 'AI'}</div>
            <div className={styles.markdownContent}><MemoizedMarkdown id={message.id} content={message.content} /></div>
          </div>
        ))}
        {props.typing && (
          <div key='typing-indicator' className={styles.message} data-role='assistant'>
            <div className={styles.roleLabel}>AI</div>
            <div className={styles.markdownContent}>...</div>
          </div>
        )}
        <ScrollIntoView trigger={props.messages.length + '|' + props.typing} />
      </div>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input value={props.input} onChange={handleInputChange} placeholder={props.placeholder ?? 'Say something...'} />
      </form>
    </div>
  );
}