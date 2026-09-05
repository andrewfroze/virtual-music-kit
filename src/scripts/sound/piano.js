class Piano {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  playNote(frequency) {
    const now = this.audioContext.currentTime;

    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    osc1.type = "triangle";
    osc1.frequency.value = frequency;

    const osc2 = this.audioContext.createOscillator();
    const gain2 = this.audioContext.createGain();
    osc2.type = "sine";
    osc2.frequency.value = frequency * 2;

    const clickOsc = this.audioContext.createOscillator();
    const clickGain = this.audioContext.createGain();
    clickOsc.type = "square";
    clickOsc.frequency.value = frequency * 4;

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.5, now + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    clickGain.gain.setValueAtTime(0, now);
    clickGain.gain.linearRampToValueAtTime(0.3, now + 0.005);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc1.connect(gain1);
    osc2.connect(gain2);
    clickOsc.connect(clickGain);

    gain1.connect(this.audioContext.destination);
    gain2.connect(this.audioContext.destination);
    clickGain.connect(this.audioContext.destination);

    osc1.start(now);
    osc2.start(now);
    clickOsc.start(now);

    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
    clickOsc.stop(now + 1.5);
  }
}

export { Piano };
