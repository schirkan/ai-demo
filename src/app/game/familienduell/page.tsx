'use client';
import { useChat } from '@ai-sdk/react';
import { MemoizedMarkdownBlock } from '@/components/MemoizedMarkdown/MemoizedMarkdown';
import styles from './styles.module.css';
import { UIMessage, } from 'ai';
import { QuizShowType } from '../../../schemas/quizShowSchema';
import ChatInput from '@/components/ChatInput/ChatInput';
import ChatMessages from '@/components/ChatMessages/ChatMessages';
import SpeechOptions from '@/components/SpeechOptions/SpeechOptions';

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
  const { messages, input, setInput, append, status } = useChat({
    api: '/api/game/familienduell',
    streamProtocol: 'text',
  });

  const lastMessage: UIMessage | undefined = messages.findLast(x => x.role === 'assistant');
  const response: QuizShowType | null = lastMessage ? getObject(lastMessage) : null;
  const actions: string[] = response?.actions || (lastMessage ? [] : ['Start']);

  const handleSubmit = (text: string) => {
    append({ content: text, role: 'user' });
    setInput('');
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <MemoizedMarkdownBlock content={response?.show ?? ''} />

        <div className={styles.callForAction}>
          <div>{response?.callForAction}</div>
          <div className='actions-buttons'>
            {actions.map(action =>
              <button key={action} onClick={() => append({ content: action, role: 'user' })}>{action}</button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.chat}>
        <ChatMessages
          messages={messages.map(mapMessage)}
          style='bubbles'
          typing={status === 'submitted' || status === 'streaming'}
        />
        <ChatInput
          onSubmit={handleSubmit}
          placeholder="Type your message..."
          input={input}
          setInput={setInput}
          showVoiceInput={true}
        />
        <SpeechOptions text={response?.speak} />
      </div>
    </div>
  );
}