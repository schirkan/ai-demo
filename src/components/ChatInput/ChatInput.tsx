'use client';
import styles from './styles.module.css';
import buttonStyles from '../../css/buttonStyles.module.css';
import { ChangeEventHandler, FormEventHandler, useCallback, useEffect, useRef } from 'react';
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

  const handleMicClick = useCallback(() => {
    if (!props.showVoiceInput) return;
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening();
    }
  }, [props.showVoiceInput, listening, resetTranscript]);

  // trigger input change when transcript updates
  useEffect(() => {
    if (transcript) {
      props.setInput(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // Focus input when listening stops
  useEffect(() => {
    if (!listening) {
      inputRef.current?.focus();
    }
  }, [listening]);

  // Handle key down events for mic toggle or focus input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement !== inputRef.current) {
        if (event.code === "Space") {
          event.preventDefault();
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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMicClick]);

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
          className={styles.micButton + " " + buttonStyles.iconButton}
          data-active={listening}
          aria-label="Toggle voice input"
          type="button">
          <BsMicFill />
        </button>
      }
      <button
        type="submit"
        disabled={!props.input}
        className={styles.submitButton + " " + buttonStyles.iconButton}>
        <BsSendFill />
      </button>
    </form>
  );
}