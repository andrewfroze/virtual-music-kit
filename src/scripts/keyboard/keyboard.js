import { Key } from "./key";
import { dispatchKeyDownEvent, dispatchKeyUpEvent } from '../piano-keys';
import { melody, renderMelody } from "../main";

class Keyboard {

  constructor() {
    this.muted = false;
  }

  assignedLightKeys = [
    new Key('KeyA'),
    new Key('KeyZ'),
    new Key('KeyS'),
    new Key('KeyX'),
    new Key('KeyD'),
    new Key('KeyC'),
    new Key('KeyF'),
    new Key('KeyV'),
    new Key('KeyG'),
    new Key('KeyB'),
    new Key('KeyH'),
    new Key('KeyN'),
    new Key('KeyJ'),
    new Key('KeyK'),
    new Key('KeyL'),
  ];

  assignedDarkKeys = [
    new Key('KeyQ'),
    new Key('KeyW'),
    new Key('KeyE'),
    new Key('KeyR'),
    new Key('KeyT'),
    new Key('KeyY'),
    new Key('KeyU'),
    new Key('KeyI'),
    new Key('KeyO'),
    new Key('KeyP'),
  ];

  mute() {
    this.muted = true;
  }

  unmute() {
    this.muted = false;
  }

 findAssignedKey(code) {
    return this.getAssignedSoundKeys()
      .find((key) => key.code === code);
  }

  findKeyByElement(element) {
    return this.getAssignedSoundKeys()
      .find((key) => key.element === element);
  }

  unassignKey(code) {
    const key = this.findAssignedKey(code);

    if (!key) {
      return;
    }

    key.code = undefined;
    key.element.querySelector('label').textContent = '';
  }

  assignKey(element, code) {
    this.unassignKey(code);
    let key = this.findKeyByElement(element);

    if (!key) {
      key = new Key(code, element);

      if (element.classList.contains('piano__keys-holder__light-key')) {
        this.assignedLightKeys.push(key);
      } else {
        this.assignedDarkKeys.push(key);
      }
    } else {
      key.code = code;
    }
  }


  isAssigned(code) {
    return Boolean(this.findAssignedKey(code));
  }

  getAssignedSoundKeys() {
    return [...this.assignedLightKeys, ...this.assignedDarkKeys];
  }

  getAssignedCodes() {
    return getAssignedSoundKeys().map((key) => key.code);
  }
}

const defaultKeyboard = new Keyboard();

window.addEventListener('keydown', (event) => {
  if (defaultKeyboard.muted) {
    return;
  }

  if (event.repeat) {
    return;
  }

  if (defaultKeyboard.activeAssignedKey) {
    return;
  }

  const assignedKey = defaultKeyboard.findAssignedKey(event.code);

  if (!assignedKey) {
    return;
  }

  dispatchKeyDownEvent(assignedKey.element);

  defaultKeyboard.activeAssignedKey = assignedKey;
});

window.addEventListener('keyup', (event) => {
  if (defaultKeyboard.muted) {
    return;
  }

  const activeKey = defaultKeyboard.activeAssignedKey;

  if (!activeKey) {
    return;
  }

  if (activeKey.code !== event.code) {
    return;
  }

  dispatchKeyUpEvent(activeKey.element);
  defaultKeyboard.activeAssignedKey = undefined;
});

export { defaultKeyboard as keyboard }