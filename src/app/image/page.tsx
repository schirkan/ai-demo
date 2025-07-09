'use client';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import styles from './styles.module.css';
import ChatInput from '@/components/ChatInput/ChatInput';
import { useState } from 'react';
import { ImageDisplay } from '@/components/ImageDisplay/ImageDisplay';

export default function Chat() {
  const [input, setInput] = useState("map in 'lord of the rings' style with a dragon in the sky, highly detailed, fantasy art, 4k resolution, intricate details, vibrant colors, epic composition, cinematic lighting, atmospheric effects, mystical elements, ancient ruins, lush landscapes, dramatic clouds");
  const [hdQuality, setHdQuality] = useState(true);
  const [style, setStyle] = useState('vivid');
  const [seed, setSeed] = useState<number | ''>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { image, error, timing, isLoading, startGeneration, resetState, activePrompt } = useImageGeneration();

  const handleSubmit = (text: string) => {
    if (!text.trim()) {
      console.warn('Empty input submitted');
      return; // Do not submit empty input
    }
    startGeneration(text, { quality: hdQuality ? 'hd' : undefined, style, seed: seed !== '' ? Number(seed) : undefined });
    setInput('');
  }

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        <h4>Options:</h4>
        <label>
          <input
            type="checkbox"
            checked={hdQuality}
            onChange={e => setHdQuality(e.target.checked)}
          />
          HD quality
        </label>
        <label>
          Style:
          <select
            value={style}
            onChange={e => setStyle(e.target.value)}
          >
            <option value="natural">natural</option>
            <option value="vivid">vivid</option>
          </select>
        </label>
        <label>
          Seed:
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Random"
            style={{ width: 80 }}
            value={seed}
            onChange={e => setSeed(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>
      </div>
      <ImageDisplay
        prompt={activePrompt}
        image={image}
        timing={timing}
        failed={!!error}
      />
      <ChatInput
        onSubmit={handleSubmit}
        placeholder="Describe your image..."
        input={input}
        setInput={setInput}
        showVoiceInput={true}
      />
    </div>
  );
}