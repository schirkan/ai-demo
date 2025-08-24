class SiriWaveProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._amplitude = 0;
    this._frequency = 0;
  }

  process(inputs) {

    const input = inputs[0];
    if (input && input[0]) {
      let amplitude = 0;
      let frequency = 0;
      const channelData = input[0];

      // Amplitudenberechnung (Peak)
      for (let i = 0; i < channelData.length; i++) {
        amplitude = Math.max(amplitude, Math.abs(channelData[i]));
      }

      // Frequenzschätzung (sehr grob, für Demo-Zwecke)
      // Hier könnte ein Zero-Crossing-Algorithmus oder FFT eingebaut werden.
      // Für Demo: Wir lassen frequency auf 0.

      // Werte an das Haupt-Thread schicken
      this.port.postMessage({
        amplitude: Math.abs(amplitude * 10),
        frequency: frequency,
      });
    }
    return true;
  }
}

registerProcessor('siriwave-processor', SiriWaveProcessor);
