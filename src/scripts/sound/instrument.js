import { Piano } from "./piano";

const notes = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  493.88, // B4
];

const audioContext = new window.AudioContext;
const piano = new Piano(audioContext);

function getNoteFrequency(index) {
  if (index < 0 || index > notes.length - 1) {
    console.log(`Unknown note ignored. Index: ${index}`);
    return;
  }
  return notes[index];
}

function playNote(index) {
  const frequency = getNoteFrequency(index);
  piano.playNote(frequency);
}

function playNoteBetween(previous, next) {
  const previousFrequency = getNoteFrequency(previous);
  const nextFrequency = getNoteFrequency(next);
  if (previousFrequency && nextFrequency) {
    piano.playNote((previousFrequency + nextFrequency) / 2);
  }
}

export { playNote, playNoteBetween }