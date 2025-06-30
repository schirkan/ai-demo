'use client';
import { MemoizedMarkdown } from '@/components/memoized-markdown';
import ScrollIntoView from '@/components/ScrollIntoView';
import styles from './styles.module.css';
import { Message } from 'ai';

export interface ChatMessagesProps {
  style?: 'default' | 'bubbles' | undefined,
  messages: Message[],
  typing?: boolean,
  typingIndicator?: string,
}

export default function ChatMessages(props: ChatMessagesProps) {
  return (
    <div className={styles.container} data-style={props.style ?? 'default'}>
      <div className={styles.messages}>
        {props.messages.map((message) => (
          <div key={message.id} className={styles.message} data-role={message.role}>
            <div className={styles.roleLabel}>{message.role === 'user' ? 'User' : 'AI'}</div>
            <div className={styles.markdownContent}><MemoizedMarkdown id={message.id} content={message.content} /></div>
          </div>
        ))}
        {props.typing && (
          <div key='typing-indicator' className={styles.typingIndicator} data-role='assistant'>
            <div className={styles.roleLabel}>AI</div>
            <div className={styles.markdownContent}>{props.typingIndicator ?? '...'}</div>
          </div>
        )}
        <ScrollIntoView trigger={props.messages.length + '|' + props.typing} />
      </div>
    </div>
  );
}