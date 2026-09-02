import '../styles/main.scss';
import { Instrument } from './sound/instrument';
import { PianoMod } from './piano-mod';
import { keyboard } from './keyboard/keyboard';
import { dispatchKeyDownEvent, dispatchKeyUpEvent } from './piano-keys';
import { getRandomValueFromArray } from './random';
import { Melody } from './sound/melody';

const exampleNotesCount = 5;
const lightKeysCount = 15;
const pianoMods = [
  new PianoMod('Piano', 'piano'),
  new PianoMod('Synth', 'synth'),
  new PianoMod('Custom', 'custom'),
];
const instrument = new Instrument();
const melody = new Melody();
setMelodyExample();

function setMelodyExample() {
  const availableNotes = keyboard.getAssignedSoundKeys();
  for (let i = 0; i < exampleNotesCount; i += 1) {
    melody.push(getRandomValueFromArray(availableNotes));
  }
}

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

const pianoMelodyContainer = document.createElement('div');
pianoMelodyContainer.className = 'piano__control-panel__mode-panel-holder__melody-container';
controlPanel.append(pianoMelodyContainer);

const pianoMelodyLabel = document.createElement('label');
pianoMelodyLabel.textContent = "Type your melody here:";
pianoMelodyLabel.className = 'piano__control-panel__mode-panel-holder__melody-container__piano-melody-label';
pianoMelodyContainer.append(pianoMelodyLabel);

const pianoMelodyInput = document.createElement('div');
pianoMelodyInput.className = 'piano__control-panel__mode-panel-holder__melody-container__piano-melody-editor';
pianoMelodyContainer.append(pianoMelodyInput);

function renderMelody() {
  pianoMelodyInput.replaceChildren();

  melody.notes.forEach((note, index) => {
    pianoMelodyInput.append(
      generateNotesElement(note, index)
    );
  });
}

function generateNotesElement(note, index) {
  const noteElement = document.createElement('div');
  noteElement.className = 'piano__control-panel__mode-panel-holder__melody-container__piano-melody-editor__note';

  const noteLabel = document.createElement('label');
  noteLabel.textContent = note.getKeyLabel();
  noteLabel.className = 'piano__control-panel__mode-panel-holder__melody-container__piano-melody-editor__note__label';
  noteElement.append(noteLabel);

  const crossIconContainer = document.createElement('div');
  crossIconContainer.className = 'piano__control-panel__mode-panel-holder__melody-container__piano-melody-editor__note__cross-icon';
  noteElement.append(crossIconContainer);

  crossIconContainer.addEventListener('click', () => {
    melody.notes.splice(index, 1);
    renderMelody();
  })
  return noteElement;
}

 renderMelody();

const pianoMelodyEditButton = document.createElement('button');
pianoMelodyEditButton.textContent = melody.editMode ? 'Apply' : 'Edit';
pianoMelodyEditButton.className = 'piano__control-panel__mode-panel-holder__melody-container__piano-melody-edit-button';
pianoMelodyContainer.append(pianoMelodyEditButton);

const pianoMelodyPlayButton = document.createElement('button');
pianoMelodyPlayButton.textContent = 'Play';
pianoMelodyPlayButton.className = 'piano__control-panel__mode-panel-holder__melody-container__piano-melody-play-button';
pianoMelodyContainer.append(pianoMelodyPlayButton);

pianoMelodyPlayButton.addEventListener('click', async () => {
  disableMelodyEditMode();
  pianoMelodyEditButton.disabled = true;
  pianoMelodyPlayButton.disabled = true;
  await playMelody(melody);
  pianoMelodyEditButton.disabled = false;
  pianoMelodyPlayButton.disabled = false;
});

pianoMelodyEditButton.addEventListener('click', () => {
  if (melody.editMode) {
    disableMelodyEditMode();
  } else {
    enableMelodyEditMode();
  }
});

function enableMelodyEditMode() {
  pianoMelodyEditButton.textContent = 'Apply';
  pianoMelodyInput.classList.add('edit');
  melody.editMode = true;
}

function disableMelodyEditMode() {
  pianoMelodyInput.classList.remove('edit');
  pianoMelodyEditButton.textContent = 'Edit';
  melody.editMode = false;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function playMelody(melody) {
  for (const note of melody.notes) {
    dispatchKeyDownEvent(note.element);

    await delay(200);

    dispatchKeyUpEvent(note.element);

    await delay(100);
  }
}

// Piano Keys

const pianoKeysHolder = document.createElement('div');
pianoKeysHolder.className = 'piano__keys-holder';
piano.append(pianoKeysHolder);

const lightKeyWidth = `calc((100vw - 3vw - 1vw - ${0.3 * (lightKeysCount - 1)}vw) / ${lightKeysCount})`
const darkKeyWidth = `calc((100vw - 3vw - 1vw - ${0.3 * (lightKeysCount - 1)}vw) / ${lightKeysCount} / 2)`;
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
  lightKey.style.width = lightKeyWidth;
  lightKeys.push(lightKey);
  lightKeysHolder.append(lightKey);



  const assignedKey = keyboard.assignedLightKeys[i];
  const lightKeyAssignedKeyLabel = document.createElement('label');
  lightKeyAssignedKeyLabel.className = 'piano__keys-holder__light-key__assigned-key-label';
  lightKeyAssignedKeyLabel.textContent = assignedKey ? assignedKey.getKeyLabel() : '';
  lightKey.append(lightKeyAssignedKeyLabel);
  if (assignedKey) {
    assignedKey.assignNewElement(lightKey);
  }

  lightKey.addEventListener('click', () => {
    instrument.playNote(i);
    if (assignedKey && melody.editMode) {
      melody.push(assignedKey);
      renderMelody();
    }
  });

  if (i > 0) {
    if (
      currentDarkKeyInsertedCount <
      darkKeysGroupsCounts[currentDarkKeysGroupIndex]
    ) {
      const darkKey = document.createElement('div');
      darkKey.style.width = darkKeyWidth;
      darkKey.className = 'piano_keys-holder__dark-key-holder__dark-key';

      darkKey.dataset.index = i;
      darkKey.style.left = `${getDarkKeyLeft(i)}px`;

      darkKeys.push(darkKey);
      darkKeysHolder.append(darkKey);

      darkKey.addEventListener('click', () => {
        instrument.playSemitoneAfter(i - 1);
      });

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

darkKeys.forEach((darkKey, i) => {
  const assignedKey = keyboard.assignedDarkKeys[i];
  const darkKeyAssignedKeyLabel = document.createElement('label');
  darkKeyAssignedKeyLabel.className = 'piano__keys-holder__dark-key__assigned-key-label';
  darkKeyAssignedKeyLabel.textContent = assignedKey ? assignedKey.getKeyLabel() : '';
  darkKey.append(darkKeyAssignedKeyLabel);
  if (assignedKey) {
    assignedKey.assignNewElement(darkKey);
  }

  darkKey.addEventListener('click', () => {
    if (melody.editMode && assignedKey) {
      melody.push(assignedKey);
      renderMelody();
    }
  });
});

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

export { melody, renderMelody }