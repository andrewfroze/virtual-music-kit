import '../styles/main.scss';
import { Instrument } from './sound/instrument';
import { PianoMod } from './piano-mod';

const lightKeysCount = 7;
const pianoMods = [
  new PianoMod('Piano', 'piano'),
  new PianoMod('Synth', 'synth'),
  new PianoMod('Custom', 'custom'),
];
const instrument = new Instrument();

const piano = document.createElement('div');
piano.className = 'piano';
document.body.append(piano);

// Piano Control Panel

const controlPanel = document.createElement('div');
controlPanel.className = 'piano__control-panel';
piano.append(controlPanel);

const pianoModPanel = document.createElement('div');
pianoModPanel.className = 'piano__control-panel__mode-panel-holder';
controlPanel.append(pianoModPanel);

pianoMods.forEach((mod, index) => {
  const pianoModContainer = document.createElement('div');
  pianoModContainer.className = 'piano__control-panel__mode-panel-holder__mode-holder';
  pianoModPanel.append(pianoModContainer);

  const pianoRadio = document.createElement('input');
  pianoRadio.type = 'radio';
  pianoRadio.name = 'piano-mod';
  pianoRadio.id = `${mod.instrument}-mod`;
  if (index === 0) {
    pianoRadio.checked = true;
  }

  const pianoModLabel = document.createElement('label');
  pianoModLabel.textContent = mod.label;

  pianoModContainer.append(pianoModLabel);
  pianoModContainer.append(pianoRadio);
  pianoRadio.addEventListener('change', () => {
    instrument.changeTo(mod.instrument);
  });
});

// Piano Keys

const pianoKeysHolder = document.createElement('div');
pianoKeysHolder.className = 'piano__keys-holder';
piano.append(pianoKeysHolder);

const lightKeys = [];
const darkKeysGroupsCounts = [2, 3];
const darkKeys = [];

const lightKeysHolder = document.createElement('div');
lightKeysHolder.className = 'piano__keys-holder__light-key-holder';
pianoKeysHolder.append(lightKeysHolder);

const darkKeysHolder = document.createElement('div');
darkKeysHolder.className = 'piano__keys-holder__dark-key-holder';
pianoKeysHolder.append(darkKeysHolder);

let currentDarkKeysGroupIndex = 0;
let currentDarkKeyInsertedCount = 0;
for (let i = 0; i < lightKeysCount; i += 1) {
  const lightKey = document.createElement('div');
  lightKey.className = 'piano__keys-holder__light-key';
  lightKeys.push(lightKey);
  lightKeysHolder.append(lightKey);

  lightKey.addEventListener('mousedown', () => {
    instrument.playNote(i);
  });

  if (i > 0) {
    if (
      currentDarkKeyInsertedCount <
      darkKeysGroupsCounts[currentDarkKeysGroupIndex]
    ) {
      const darkKey = document.createElement('div');
      darkKey.className = 'piano_keys-holder__dark-key-holder__dark-key';

      darkKey.dataset.index = i;
      darkKey.style.left = `${getDarkKeyLeft(i)}px`;

      darkKeys.push(darkKey);
      darkKeysHolder.append(darkKey);

      darkKey.addEventListener('mousedown', () => {
        instrument.playNoteBetween(i - 1, i);
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

window.addEventListener('resize', () => {
  darkKeys.forEach((darkKey) => {
    const index = Number(darkKey.dataset.index);

    darkKey.style.left = `${getDarkKeyLeft(index)}px`;
  });
});

function getDarkKeyLeft(index) {
  const previousKeyRect = lightKeys[index - 1].getBoundingClientRect();
  const currentKeyRect = lightKeys[index].getBoundingClientRect();
  const gapCenter = (currentKeyRect.left + previousKeyRect.right) / 2;

  return gapCenter - pianoKeysHolder.getBoundingClientRect().left;
}