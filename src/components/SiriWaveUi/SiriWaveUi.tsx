'use-client';

import React, { useEffect, useRef } from "react";
import SiriWave from "siriwave";

import { useSiriWave } from "./useSiriWave";

interface SiriWaveUiProps extends React.ComponentProps<"div"> {
    active: boolean;
}

async function handleSuccess(stream: MediaStream, siriWave: SiriWave): Promise<() => void> {
    const audioContext = new window.AudioContext();
    await audioContext.audioWorklet.addModule('/siriWave-processor.js');
    const source = audioContext.createMediaStreamSource(stream);
    const workletNode = new window.AudioWorkletNode(audioContext, 'siriwave-processor');

    source.connect(workletNode);
    // workletNode muss nicht mit audioContext.destination verbunden werden, da wir nur analysieren

    siriWave.start();

    workletNode.port.onmessage = (event: MessageEvent) => {
        const { amplitude, frequency } = event.data;
        siriWave.setAmplitude(amplitude);
        siriWave.setSpeed(frequency);
    };

    return () => {
        siriWave.setAmplitude(0);
        siriWave.setSpeed(0);
        workletNode.port.onmessage = null;
        source.disconnect();
        workletNode.disconnect();
        audioContext.close();
    };
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
            .then(dispose => disposeRef.current = dispose)
            .catch((err) => {
                // Fehlerbehandlung, z.B. Logging oder UI-Feedback
                console.error('Mikrofonzugriff fehlgeschlagen:', err);
            });

        return () => {
            disposeRef.current?.();
        }
    }, [active, siriWave]);

    return (
        <div ref={containerRef} {...divProps}></div>
    );
};
