'use client';
import { useRef } from 'react';
import { MemoizedMarkdown } from '@/components/MemoizedMarkdown/MemoizedMarkdown';
import { Message } from 'ai';
import ScrollIntoView from '@/components/ScrollIntoView/ScrollIntoView';
import styles from './styles.module.css';
import ScrollToButton from '../ScrollToButton/ScrollToButton';
import { BsArrowClockwise } from "react-icons/bs";
import buttonStyles from '../../css/buttonStyles.module.css';

export interface ChatMessagesProps {
  style?: 'default' | 'whatsapp' | 'ios' | undefined,
  messages: Message[],
  typing?: boolean,
  typingIndicator?: string,
  error?: Error,
  reload?: () => void,
}

export default function ChatMessages(props: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container} data-style={props.style ?? 'default'}>
      <div className={styles.messages} ref={scrollRef}>
        {props.messages.map((message) => (
          <div key={message.id} className={styles.message} data-role={message.role}>
            <div className={styles.roleLabel}>{message.role === 'user' ? 'User' : 'AI'}</div>
            <div className={styles.messageContent}><MemoizedMarkdown id={message.id} content={message.content} /></div>
          </div>
        ))}
        {props.typing && (
          <div key='typing-indicator' className={styles.typingIndicator} data-role='assistant'>
            <div className={styles.roleLabel}>AI</div>
            <div className={styles.messageContent}>{props.typingIndicator ?? '...'}</div>
          </div>
        )}
        {props.error && (
          <div className={styles.error}>
            {props.reload && (
              <button
                onClick={props.reload}
                className={styles.reloadButton + " " + buttonStyles.iconButton}>
                <BsArrowClockwise />
              </button>
            )}
            <div>Error: {props.error.message}</div>
          </div>
        )}
        <ScrollIntoView trigger={props.messages.length + "|" + scrollRef.current?.scrollHeight} />
        <ScrollToButton direction='down' scrollRef={scrollRef} />
      </div>
    </div>
  );
}