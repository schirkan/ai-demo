'use client';
import styles from './styles.module.css';
import { ChangeEventHandler, FormEventHandler, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { BsMicFill } from 'react-icons/bs';
import { BsSendFill } from 'react-icons/bs';

export interface ChatInputProps {
  onSubmit: (text: string) => void,
  placeholder: string,
  input: string,
  setInput: (text: string) => void,
  showVoiceInput?: boolean,
}

export default function ChatInput(props: ChatInputProps) {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    props.onSubmit(props.input);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event): void => {
    props.setInput(event.target.value);
  };

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening();
    }
  };

  useEffect(() => {
    if (transcript) {
      props.setInput(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  useEffect(() => {
    if (!listening) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  useEffect(() => {
    const handleSpace = (event: KeyboardEvent) => {
      if (document.activeElement !== inputRef.current) {
        event.preventDefault();
        if (event.code === "Space") {
          handleMicClick();
        } else {
          inputRef.current?.focus();
        }
      } else if (event.code === "Space" && event.ctrlKey) {
        // Prevent default space behavior in input field
        event.preventDefault();
        handleMicClick();
      }
    };
    window.addEventListener("keydown", handleSpace);
    return () => window.removeEventListener("keydown", handleSpace);
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.inputForm}>
      <input
        ref={inputRef}
        className={styles.inputTextbox}
        value={props.input}
        onChange={handleInputChange}
        placeholder={props.placeholder ?? 'Say something...'} />
      {props.showVoiceInput &&
        <button
          onClick={handleMicClick}
          className={styles.mic}
          data-active={listening}
          aria-label="Toggle voice input"
          type="button">
          <BsMicFill />
        </button>
      }
      <button
        type="submit"
        disabled={!props.input}
        className={styles.submitButton}>
        <BsSendFill />
      </button>
    </form>
  );
}