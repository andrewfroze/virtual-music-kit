class Synth {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  playNote(frequency) {
    const now = this.audioContext.currentTime;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1);

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 1);
  }
}

export { Synth };