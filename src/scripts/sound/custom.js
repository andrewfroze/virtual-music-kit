class Custom {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  playNote(frequency) {
    const now = this.audioContext.currentTime;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = 'square';

    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 3,
      now + 0.08
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency,
      now + 0.15
    );

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }
}

export { Custom };