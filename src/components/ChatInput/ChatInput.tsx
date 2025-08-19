'use client';

import { BsMicFill, BsSendFill, BsFillStopFill } from 'react-icons/bs';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ChangeEventHandler, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useLatest, useUnmount } from 'react-use';

import styles from './styles.module.css';
import buttonStyles from '../../css/buttonStyles.module.css';
import TextareaAutosize from '../TextareaAutosize/TextareaAutosize';
import { SiriWaveUi } from '../SiriWaveUi/SiriWaveUi';

export interface ChatInputProps {
  style?: 'default' | 'combined' | undefined;
  onSubmit: (text: string) => void;
  placeholder?: string;
  showVoiceInput?: boolean;
  loading?: boolean;
  initialValue?: string;
  stop?: () => void;
}

export default function ChatInput({ onSubmit, placeholder, showVoiceInput, loading, initialValue, stop, style = 'default' }: ChatInputProps) {
  const [input, setInput] = useState(initialValue);
  const { transcript, finalTranscript, listening, resetTranscript } = useSpeechRecognition();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const latestInput = useLatest(input);
  const latestOnSubmit = useLatest(onSubmit);
  useUnmount(SpeechRecognition.stopListening);

  useEffect(() => {
    if (initialValue) setInput(initialValue);
  }, [initialValue]);

  const handleSubmit = useCallback((event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const value = latestInput.current || '';
    if (loading || value.trim() === '') return;
    latestOnSubmit.current(value);
    setInput('');
  }, [loading, latestInput, latestOnSubmit]);

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

  const micButtonVisible = style === 'combined' ? showVoiceInput && !loading && (!input || listening) : showVoiceInput;
  const stopButtonVisible = loading && stop;
  const sendButtonVisible = style === 'combined' ? !stopButtonVisible && input && !listening : !stopButtonVisible;

  return (
    <form onSubmit={handleSubmit} className={styles.inputForm} data-style={style}>
      <TextareaAutosize
        ref={inputRef}
        className={styles.inputTextbox}
        value={input}
        onChange={handleTextareaChange}
        placeholder={placeholder ?? 'Say something...'} />

      {micButtonVisible &&
        <button
          onClick={handleMicClick}
          className={styles.micButton + " " + buttonStyles.iconButton}
          data-active={listening}
          aria-label="Toggle voice input"
          type="button">
          <BsMicFill />
        </button>
      }
      {stopButtonVisible &&
        <button type="button" onClick={stop} className={styles.stopButton + " " + buttonStyles.iconButton}>
          <BsFillStopFill />
        </button>
      }
      {sendButtonVisible &&
        <button type="submit" disabled={!input || loading} className={styles.submitButton + " " + buttonStyles.iconButton}>
          <BsSendFill />
        </button>
      }
      {listening &&
        <SiriWaveUi active={true} className={styles.wave} />
      }
    </form>
  );
}