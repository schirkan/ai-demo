/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import styles from './styles.module.css';
import { useState } from 'react';
import { useSpeech } from 'react-text-to-speech';
import { BsFillStopFill } from "react-icons/bs";
import { HiSpeakerWave } from "react-icons/hi2";
import { HiSpeakerXMark } from "react-icons/hi2";

export interface SpeechOptionsProps {
  text?: string
}

export default function SpeechOptions(props: SpeechOptionsProps) {
  const [autoPlay, setAutoPlay] = useState(true);
  const [lang, setLang] = useState('de-DE');
  const [voiceURI, setVoiceURI] = useState('Microsoft Conrad Online (Natural) - German (Germany)');

  const { speechStatus, stop } = useSpeech({
    text: props?.text?.replaceAll('**', ''),
    autoPlay,
    lang,
    voiceURI,
  });

  return (
    <div className={styles.container}>

      <button
        onClick={() => setAutoPlay(!autoPlay)}
        title="Toggle Auto Play">
        {autoPlay ? <HiSpeakerWave /> : <HiSpeakerXMark />}
      </button>

      <button disabled={speechStatus === "stopped"} onClick={stop}>
        <BsFillStopFill />
      </button>

    </div>
  );
}

