import { Key } from "./key";

class Keyboard {

  constructor() {
    this.muted = false;
  }

  assignedLightKeys = [
    new Key('KeyA'),
    new Key('KeyS'),
    new Key('KeyD'),
    new Key('KeyF'),
    new Key('KeyG'),
    new Key('KeyH'),
    new Key('KeyJ'),
  ];

  assignedDarkKeys = [
    new Key('KeyW'),
    new Key('KeyE'),
    new Key('KeyT'),
    new Key('KeyY'),
    new Key('KeyU'),
  ];

  mute() {
    this.muted = true;
  }

  unmute() {
    this.muted = false;
  }

  findAssignedKey(code) {
    for (const  assignedKey of [...this.assignedLightKeys, ...this.assignedDarkKeys]) {
      if (assignedKey.code === code) {
        return assignedKey;
      }
    }
  }

  getAssignedSoundKeys() {
    return [...this.assignedLightKeys, ...this.assignedDarkKeys];
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

  assignedKey.element.dispatchEvent(new MouseEvent('mousedown'));
  assignedKey.element.classList.add('active');
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

  activeKey.element.classList.remove('active');
  defaultKeyboard.activeAssignedKey = undefined;
});

export { defaultKeyboard as keyboard }