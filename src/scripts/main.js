import '../styles/main.scss';
import { Instrument } from './sound/instrument';
import { PianoMod } from './piano-mod';
import { keyboard } from './keyboard/keyboard';
import { dispatchKeyDownEvent, dispatchKeyUpEvent } from './piano-keys';
import { getRandomValueFromArray } from './random';
import { Melody } from './sound/melody';
import { parseKeyLabel } from './keyboard/key';

const exampleNotesCount = 5;
const lightKeysCount = 10;
const maxMelodySize = 34;
const pianoMods = [
  new PianoMod('Piano', 'piano'),
  new PianoMod('Synth', 'synth'),
  new PianoMod('Custom', 'custom'),
];
const instrument = new Instrument();
const melody = new Melody(maxMelodySize);
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
  noteElement.draggable = true;
  noteElement.dataset.index = index;
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
  const pianoCover = document.createElement('div');
  pianoCover.className = 'piano__cover';
  piano.append(pianoCover);
  pianoMelodyEditButton.disabled = true;
  pianoMelodyPlayButton.disabled = true;
  await playMelody(melody);
  pianoCover.remove();
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

let reassignIconSvgDocument;

async function loadReassignKeyIcon() {
  const response = await fetch('/src/images/reassign-icon.svg');
  const svgText = await response.text();
  const parser = new DOMParser();
  reassignIconSvgDocument = parser.parseFromString(svgText, 'image/svg+xml');
}

await loadReassignKeyIcon();

function addReassignIcon(keyElement) {
  const reassignKeyIcon = reassignIconSvgDocument.documentElement.cloneNode(true);
  reassignKeyIcon.classList.add('piano__keys-holder__light-key__reassign-key-icon');
  keyElement.append(reassignKeyIcon);

  return reassignKeyIcon;
}

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

  const reassignIcon = addReassignIcon(lightKey);

  lightKey.addEventListener('mousedown', (event) => {
    if (reassignIcon.contains(event.target)) {
      openAssignKeyModal(lightKey, lightKeyAssignedKeyLabel);
      return;
    }
    lightKey.classList.add('active');
    instrument.playNote(i)
    if (assignedKey && melody.editMode) {
      if (melody.push(assignedKey)) {
        renderMelody();
      };
    }
  });

  lightKey.addEventListener('mouseup', () => {
    lightKey.classList.remove('active');
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

async function openAssignKeyModal(keyElement, keyLabelElement) {
  keyboard.mute();
  keyElement.classList.add('edit');

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.append(overlay);

  const assignButtonModal = document.createElement('div');
  assignButtonModal.className = 'overlay__assign-button-modal';
  overlay.append(assignButtonModal);

  piano.classList.add('blured');

  const modalLabel = document.createElement('label');
  modalLabel.textContent = 'Press new key to assign';
  assignButtonModal.append(modalLabel);

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel (ESC)';
  assignButtonModal.append(cancelButton);

  let closeBlocked = false;

  overlay.addEventListener('click', (event) => {
    if (!closeBlocked && !assignButtonModal.contains(event.target)) {
      closeEditMode();
      return;
    }
  });

  cancelButton.addEventListener('click', () => {
    closeEditMode();
  });

  function closeEditMode() {
    overlay.remove();
    piano.classList.remove('blured');
    keyboard.unmute();
    keyElement.classList.remove('edit');
  }

  let newKey;

  while (true) {

    newKey = await waitForKey();

    if (newKey === 'Escape') {
      assignButtonModal.classList.add('hidden');

      const confirmed = await showConfirmMessage('cancel');

      if (confirmed) {
        closeEditMode();
        return;
      } else {
        assignButtonModal.classList.remove('hidden');
      }
    }


    if (!newKey.startsWith('Key') && !newKey.startsWith('Digit')) {
      continue;
    }

    const isTaken = keyboard.isAssigned(newKey);

    if (isTaken) {
      assignButtonModal.classList.add('hidden');

      const takenMessage = `Key '${parseKeyLabel(newKey)}' is already taken.`;

      const replaceConformed = await showConfirmMessage(
        'replacement',
        takenMessage
      );

      assignButtonModal.classList.remove('hidden');

      if (replaceConformed) {
        break;
      }
    } else {
      assignButtonModal.classList.add('hidden');

      const assignConformed = await showConfirmMessage('assignment');

      assignButtonModal.classList.remove('hidden');

      if (assignConformed) {
        break;
      }
    }
  }
  keyboard.assignKey(keyElement, newKey);
  keyLabelElement.textContent = parseKeyLabel(newKey);
  closeEditMode();
  
  async function showConfirmMessage(goal, additionalMessage = undefined) {
    closeBlocked = true;
    const confirmMessage = document.createElement('label');
    const confirmMessageText = `Press 'Enter' to confirm ${goal}`;
    confirmMessage.textContent = additionalMessage ?  additionalMessage.concat(`\n${confirmMessageText}`) : confirmMessageText;
    confirmMessage.className = 'overlay__assign-button-modal';
    overlay.append(confirmMessage);

    let key;
    do {
      key = await waitForKey();
    } while (key !== 'Enter' && key !== 'Escape');

    closeBlocked = false;
    confirmMessage.remove();
    return key === 'Enter';
  }
}

function waitForKey() {
  return new Promise((resolve) => {
    const handleKeyDown = (event) => {
      event.preventDefault();

      window.removeEventListener('keydown', handleKeyDown);

      resolve(event.code);
    };

    window.addEventListener('keydown', handleKeyDown);
  });
}

darkKeys.forEach((darkKey, i) => {
  const assignedKey = keyboard.assignedDarkKeys[i];
  const darkKeyAssignedKeyLabel = document.createElement('label');
  darkKeyAssignedKeyLabel.className = 'piano__keys-holder__dark-key__assigned-key-label';
  darkKeyAssignedKeyLabel.textContent = assignedKey ? assignedKey.getKeyLabel() : '';
  darkKey.append(darkKeyAssignedKeyLabel);
  const reassignIcon = addReassignIcon(darkKey);
  if (assignedKey) {
    assignedKey.assignNewElement(darkKey);
  }

  darkKey.addEventListener('mousedown', (event) => {
    if (reassignIcon.contains(event.target)) {
      openAssignKeyModal(darkKey, darkKeyAssignedKeyLabel);
      return;
    }
    if (melody.editMode && assignedKey) {
      if(melody.push(assignedKey)) {
        renderMelody();
      }
    }
    darkKey.classList.add('active');
    instrument.playSemitoneAfter(i + 1)
  });

  darkKey.addEventListener('mouseup', () => {
    darkKey.classList.remove('active');
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