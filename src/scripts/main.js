import "../styles/main.scss";

const lightKeysCount = 7;

const piano = document.createElement("div");
piano.className = "piano";
document.body.append(piano);

const controlPanel = document.createElement("div");
controlPanel.className = "piano__control-panel";
piano.append(controlPanel);

const pianoKeysHolder = document.createElement("div");
pianoKeysHolder.className = "piano__keys-holder";
piano.append(pianoKeysHolder);

const lightKeys = [];
const darkKeysGroupsCounts = [2, 3];
const darkKeys = [];

const lightKeysHolder = document.createElement("div");
lightKeysHolder.className = "piano__keys-holder__light-key-holder";
pianoKeysHolder.append(lightKeysHolder);

const darkKeysHolder = document.createElement("div");
darkKeysHolder.className = "piano__keys-holder__dark-key-holder";
pianoKeysHolder.append(darkKeysHolder);

let currentDarkKeysGroupIndex = 0;
let currentDarkKeyInsertedCount = 0;
for (let i = 0; i < lightKeysCount; i += 1) {
  const lightKey = document.createElement("div");
  lightKey.className = "piano__keys-holder__light-key";
  lightKeys.push(lightKey);
  lightKeysHolder.append(lightKey);

  lightKey.addEventListener('mousedown', () => {
    playNote(i);
  });

  if (i > 0) {
    if (
      currentDarkKeyInsertedCount <
      darkKeysGroupsCounts[currentDarkKeysGroupIndex]
    ) {
      const darkKey = document.createElement("div");
      darkKey.className = "piano_keys-holder__dark-key-holder__dark-key";

      const previousKeyRect = lightKeys[i - 1].getBoundingClientRect();
      const currentKeyRect = lightKeys[i].getBoundingClientRect();
      const gapCenter = (currentKeyRect.left + previousKeyRect.right) / 2;

      const left = gapCenter - pianoKeysHolder.getBoundingClientRect().left;
      darkKey.style.left = `${left}px`;
      darkKeys.push(darkKey);
      darkKeysHolder.append(darkKey);

      darkKey.addEventListener('mousedown', () => {
        playNoteBetween(i - 1, i);
      })

      currentDarkKeyInsertedCount += 1;
    } else {
      currentDarkKeyInsertedCount = 0;
      currentDarkKeysGroupIndex += 1;
      if (currentDarkKeysGroupIndex > darkKeysGroupsCounts.length - 1) {
        currentDarkKeysGroupIndex = 0;
      }
    }
  }
}

const notes = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  493.88, // B4
];

function getNoteFrequency(index) {
  if (index < 0 || index > notes.length - 1) {
    console.log(`Unknown note ignored. Index: ${index}`);
    return;
  }
  return notes[index];
}

function playNote(index) {
  const frequency = getNoteFrequency(index);
  playPianoNote(frequency);
}

function playNoteBetween(previous, next) {
  const previousFrequency = getNoteFrequency(previous);
  const nextFrequency = getNoteFrequency(next);
  if (previousFrequency && nextFrequency) {
    playPianoNote((previousFrequency + nextFrequency) / 2);
  }
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPianoNote(frequency) {
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.value = frequency;

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = frequency * 2;

    const clickOsc = audioCtx.createOscillator();
    const clickGain = audioCtx.createGain();
    clickOsc.type = 'square';
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

    gain1.connect(audioCtx.destination);
    gain2.connect(audioCtx.destination);
    clickGain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    clickOsc.start(now);

    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
    clickOsc.stop(now + 1.5);
}