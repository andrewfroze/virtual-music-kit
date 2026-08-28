import { Piano } from './piano';
import { Synth } from './synth';
import { Custom } from './custom';

const notes = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  493.88, // B4
];


class Instrument {

  constructor() {
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
    if (index < 0 || index > notes.length - 1) {
        console.log(`Unknown note ignored. Index: ${index}`);
        return;
    }
    return notes[index];
  }

  playNote(index) {
    const frequency = this.getNoteFrequency(index);
    this.active.playNote(frequency);
  }

  playNoteBetween(previous, next) {
    const previousFrequency = this.getNoteFrequency(previous);
    const nextFrequency = this.getNoteFrequency(next);
    if (previousFrequency && nextFrequency) {
        this.active.playNote((previousFrequency + nextFrequency) / 2);
    }
  }

}
export { Instrument }