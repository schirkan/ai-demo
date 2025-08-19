'use client';

import { UIMessage } from 'ai';
import { BsArrowClockwise } from "react-icons/bs";
import { useRef } from 'react';

import buttonStyles from '../../css/buttonStyles.module.css';
import ScrollToButton from '../ScrollToButton/ScrollToButton';
import styles from './styles.module.css';
import { MemoizedMarkdown } from '@/components/MemoizedMarkdown/MemoizedMarkdown';
import ScrollIntoView from '@/components/ScrollIntoView/ScrollIntoView';
import { getMessageText } from '@/utils/UIMessageHelper';

export interface ChatMessagesProps {
  style?: 'default' | 'whatsapp' | 'ios' | undefined;
  messages: UIMessage[];
  loading?: boolean;
  error?: Error;
  regenerate?: () => void;
}

function renderMessage(message: UIMessage) {
  const text = getMessageText(message);
  if (!text) return null;
  return (
    <div key={message.id} className={styles.message} data-role={message.role}>
      <div className={styles.roleLabel}>{message.role === 'user' ? 'User' : 'AI'}</div>
      <div className={styles.messageContent}>
        <MemoizedMarkdown
          id={message.id}
          content={text}
        />
      </div>
    </div>
  );
}

export default function ChatMessages(props: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container} data-style={props.style ?? 'default'}>
      <div className={styles.messages} ref={scrollRef}>
        {props.messages.map(renderMessage)}
        {props.loading && (
          <div className={styles.typingIndicator}>
            <div className={styles.loader}></div>
          </div>
        )}
        {props.error && (
          <div className={styles.error}>
            {props.regenerate && (
              <button type="button" onClick={props.regenerate} className={styles.reloadButton + " " + buttonStyles.iconButton}>
                <BsArrowClockwise />
              </button>
            )}
            <div className={styles.errorMessage}>Error: {props.error.message}</div>
          </div>
        )}
        <ScrollIntoView trigger={props.messages.length + "|" + scrollRef.current?.scrollHeight} />
        <ScrollToButton direction='down' scrollRef={scrollRef} />
      </div>
    </div>
  );
}
