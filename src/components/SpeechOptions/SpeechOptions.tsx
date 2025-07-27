'use client';
import buttonStyles from '../../css/buttonStyles.module.css';
import styles from './styles.module.css';
import { useState } from 'react';
import { useSpeech, useVoices } from 'react-text-to-speech';
import { BsFillStopFill, BsFillGearFill } from "react-icons/bs";
import { HiSpeakerWave } from "react-icons/hi2";
import { HiSpeakerXMark } from "react-icons/hi2";

export interface SpeechOptionsProps {
  text?: string
}

export default function SpeechOptions(props: SpeechOptionsProps) {
  const [enabled, setAutoPlay] = useState(true);
  const [lang, setLang] = useState('de-DE');
  const [voiceURI, setVoiceURI] = useState('Microsoft Conrad Online (Natural) - German (Germany)');
  const [showOptions, setShowOptions] = useState(false);

  const text = props?.text?.replaceAll('**', '');

  const { voices, languages } = useVoices();
  const { speechStatus, stop } = useSpeech({ text, autoPlay: enabled, lang, voiceURI, });

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <button className={buttonStyles.iconButton} data-visible={enabled} disabled={speechStatus === "stopped"} onClick={stop}>
          <BsFillStopFill />
        </button>
        <button className={buttonStyles.iconButton} data-visible={enabled} onClick={() => setShowOptions(v => !v)} title="Optionen anzeigen / verbergen">
          <BsFillGearFill />
        </button>
        <button className={buttonStyles.iconButton} onClick={() => setAutoPlay(!enabled)} title="Sprachausgabe aktivieren / deaktivieren">
          {enabled ? <HiSpeakerWave /> : <HiSpeakerXMark />}
        </button>
      </div>
      {showOptions && (
        <div className={styles.options}>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            {languages.map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
          <select value={voiceURI} onChange={(e) => setVoiceURI(e.target.value)}>
            {voices.filter(x => x.lang === lang).map((voice, index) => (
              <option key={index} value={voice.voiceURI}>{voice.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

