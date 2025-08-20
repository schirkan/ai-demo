'use-client';

import React, { useEffect, useRef } from "react";
import { useSiriWave } from "./useSiriWave";
import SiriWave from "siriwave";

interface SiriWaveUiProps extends React.ComponentProps<"div"> {
    active: boolean;
}

function handleSuccess(stream: MediaStream, siriWave: SiriWave): () => void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(1024, 1, 1);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;
    const myDataArray = new Float32Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyser.connect(processor);
    processor.connect(audioContext.destination);

    siriWave.start();

    processor.onaudioprocess = function (e) {
        let amplitude = 0;
        let frequency = 0;

        analyser.getFloatFrequencyData(myDataArray);

        myDataArray.forEach((item, index) => {
            if (item > -100) {
                frequency = Math.max(index, frequency);
            }
        });

        frequency = ((1 + frequency) * 11.7185) / 24000;
        siriWave.setSpeed(frequency);

        e.inputBuffer.getChannelData(0).forEach((item) => {
            amplitude = Math.max(amplitude, Math.abs(item));
        });

        amplitude = Math.abs(amplitude * 10);

        if (amplitude >= 0) {
            siriWave.setAmplitude(amplitude);
        } else {
            siriWave.setAmplitude(0.0);
        }
    };

    return () => {
        siriWave?.setAmplitude(0);
        siriWave?.setSpeed(0);
        if (source) {
            source.disconnect();
        }
        if (processor) {
            processor.disconnect();
        }
        if (audioContext) {
            audioContext.close();
        }
    }
}

export const SiriWaveUi: React.FC<SiriWaveUiProps> = ({ active, ...divProps }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const disposeRef = useRef<() => void>(null)

    const { siriWave } = useSiriWave({
        container: containerRef,
        autostart: true,
        theme: "ios9",
        speed: 0.0,
        pixelDepth: 1,
        lerpSpeed: 0.1,
        cover: true,
        amplitude: 0.0,
    });

    useEffect(() => {
        if (!siriWave) return;
        if (!active) return;

        navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then(stream => handleSuccess(stream, siriWave))
            .then(dispose => disposeRef.current = dispose);

        return () => {
            disposeRef.current?.();
        }
    }, [active, siriWave]);

    return (
        <div ref={containerRef} {...divProps}></div>
    );
};
