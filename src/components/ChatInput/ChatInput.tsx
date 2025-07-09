'use client';
import styles from './styles.module.css';
import buttonStyles from '../../css/buttonStyles.module.css';
import { ChangeEventHandler, FormEvent, useCallback, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { BsMicFill } from 'react-icons/bs';
import { BsSendFill } from 'react-icons/bs';
import TextareaAutosize from '../TextareaAutosize/TextareaAutosize';

export interface ChatInputProps {
  onSubmit: (text: string) => void,
  placeholder: string,
  input: string,
  setInput: (text: string) => void,
  showVoiceInput?: boolean,
}

export default function ChatInput(props: ChatInputProps) {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback((event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    props.onSubmit(props.input);
  }, [props.onSubmit, props.input]);

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (event): void => {
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
      if (event.code === "Tab") return; // Ignore Tab key to prevent focus issues

      // Toggle mic on Space + Ctrl
      if (event.code === "Space" && event.ctrlKey) {
        event.preventDefault();
        handleMicClick();
        return;
      }

      // submit on Ctrl + Enter
      if (event.code === "Enter" && event.ctrlKey && document.activeElement === inputRef.current) {
        event.preventDefault();
        handleSubmit();
        return
      }

      // Ignore modifier keys to prevent conflicts
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        return;
      }

      // If input is not focused, focus it or toggle mic
      if (document.activeElement !== inputRef.current) {
        if (document.activeElement?.tagName === 'INPUT') return;
        if (document.activeElement?.tagName === 'TEXTAREA') return;
        if (event.code === "Space") {
          event.preventDefault();
          handleMicClick();
        } else {
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMicClick, handleSubmit]);

  return (
    <form onSubmit={handleSubmit} className={styles.inputForm}>
      <TextareaAutosize
        ref={inputRef}
        className={styles.inputTextbox}
        value={props.input}
        onChange={handleTextareaChange}
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