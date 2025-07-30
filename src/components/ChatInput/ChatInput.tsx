'use client';
import styles from './styles.module.css';
import buttonStyles from '../../css/buttonStyles.module.css';
import { ChangeEventHandler, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { BsMicFill } from 'react-icons/bs';
import { BsSendFill } from 'react-icons/bs';
import TextareaAutosize from '../TextareaAutosize/TextareaAutosize';
import { useLatest, useUnmount } from 'react-use';

export interface ChatInputProps {
  onSubmit: (text: string) => void,
  placeholder?: string,
  showVoiceInput?: boolean,
  disabled?: boolean,
  initialValue?: string,
}

export default function ChatInput({ onSubmit, placeholder, showVoiceInput, disabled, initialValue }: ChatInputProps) {
  const [input, setInput] = useState(initialValue ?? '');
  const { transcript, finalTranscript, listening, resetTranscript } = useSpeechRecognition();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const latestInput = useLatest(input);
  const latestOnSubmit = useLatest(onSubmit);
  useUnmount(SpeechRecognition.stopListening);

  const handleSubmit = useCallback((event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const value = latestInput.current;
    if (disabled || value.trim() === '') return;
    latestOnSubmit.current(value);
    setInput('');
  }, [disabled, latestInput, latestOnSubmit]);

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (event): void => {
    setInput(event.target.value);
  };

  const handleMicClick = useCallback(() => {
    if (!showVoiceInput) return;
    if (listening) {
      SpeechRecognition.abortListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [showVoiceInput, listening, resetTranscript]);

  // trigger input change when transcript updates
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (finalTranscript.trim() !== '') {
      latestOnSubmit.current(finalTranscript);
      setInput('');
      resetTranscript();
    }
  }, [finalTranscript, latestOnSubmit, resetTranscript]);

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
      if (event.code === "Enter" && !event.shiftKey && document.activeElement === inputRef.current) {
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
        value={input}
        onChange={handleTextareaChange}
        placeholder={placeholder ?? 'Say something...'} />
      {showVoiceInput &&
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
        disabled={!input || disabled}
        className={styles.submitButton + " " + buttonStyles.iconButton}>
        <BsSendFill />
      </button>
    </form>
  );
}