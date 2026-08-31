import { Piano } from './piano';
import { Synth } from './synth';
import { Custom } from './custom';

const whiteKeySemitones = [0, 2, 4, 5, 7, 9, 11];

class Instrument {

  constructor() {
    this.baseFrequency = 261.63;
    this.audioContext = new window.AudioContext;
    this.piano = new Piano(this.audioContext);
    this.synth = new Synth(this.audioContext);
    this.custom = new Custom(this.audioContext);
    this.active = this.piano;
  }

  changeTo(instrument) {
    switch (instrument) {
      case 'custom':
        this.active = this.custom;
        break;
      case 'synth':
        this.active = this.synth;
        break;
      default:
        this.active = this.piano;
    }
  }

  getNoteFrequency(index) {
    if (index < 0) {
        console.log(`Invalid note index. Index: ${index}`);
        return;
    }
    const octave = Math.floor(index / 7);
    const noteIndex = index % 7;

    const semitone = octave * 12 + whiteKeySemitones[noteIndex];

    return this.baseFrequency * 2 ** (semitone / 12);
  }

  playNote(index) {
    const frequency = this.getNoteFrequency(index);
    this.active.playNote(frequency);
  }

  playSemitoneAfter(previous) {
    const previousFrequency = this.getNoteFrequency(previous);

    this.active.playNote(
      previousFrequency * 2 ** (1 / 12)
    );
  }

}
export { Instrument }