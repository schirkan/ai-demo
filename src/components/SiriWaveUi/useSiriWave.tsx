import { useEffect, useState } from 'react'
import SiriWave from 'siriwave'
import type { ICurveDefinition } from 'siriwave';
import type React from 'react';

declare type CurveStyle = 'ios' | 'ios9'

export interface IReactSiriwaveProps {
  container: React.RefObject<HTMLElement | null>;
  theme?: CurveStyle;
  ratio?: number;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  color?: string;
  cover?: boolean;
  width?: number;
  height?: number;
  autostart?: boolean;
  pixelDepth?: number;
  lerpSpeed?: number;
  curveDefinition?: Array<ICurveDefinition>;
}

export function useSiriWave(props: IReactSiriwaveProps) {
  const [siriWave, setSiriWave] = useState<SiriWave | null>(null); // useRef<SiriWave | null>(null);

  useEffect(() => {
    if (!props.container.current) return;

    const instance = new SiriWave({
      container: props.container.current,
      style: props.theme ?? 'ios',
      width: props.width ?? 640,
      height: props.height ?? 200,
      speed: props.speed ?? 0.01,
      amplitude: props.amplitude ?? 1,
      frequency: props.frequency ?? 10,
      color: props.color ?? '#fff',
      cover: props.cover ?? false,
      autostart: props.autostart ?? true,
      pixelDepth: props.pixelDepth ?? 0.02,
      lerpSpeed: props.lerpSpeed ?? 0.01,
      curveDefinition: props.curveDefinition,
    });

    setSiriWave(instance);

    return () => {
      instance.dispose()
    }
  }, [
    props.container,
    props.amplitude,
    props.autostart,
    props.color,
    props.cover,
    props.curveDefinition,
    props.frequency,
    props.height,
    props.lerpSpeed,
    props.pixelDepth,
    props.speed,
    props.theme,
    props.width
  ])

  return {
    siriWave
  };
}
