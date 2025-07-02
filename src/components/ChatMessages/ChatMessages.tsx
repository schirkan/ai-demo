'use client';
import { useRef } from 'react';
import { MemoizedMarkdown } from '@/components/MemoizedMarkdown/MemoizedMarkdown';
import { Message } from 'ai';
import ScrollIntoView from '@/components/ScrollIntoView/ScrollIntoView';
import styles from './styles.module.css';
import ScrollToButton from '../ScrollToButton/ScrollToButton';

export interface ChatMessagesProps {
  style?: 'default' | 'bubbles' | undefined,
  messages: Message[],
  typing?: boolean,
  typingIndicator?: string,
}

export default function ChatMessages(props: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container} data-style={props.style ?? 'default'}>
      <div className={styles.messages} ref={scrollRef}>
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
        <ScrollIntoView trigger={scrollRef.current?.scrollHeight} />
        <ScrollToButton direction='down' scrollRef={scrollRef} />
      </div>
    </div>
  );
}