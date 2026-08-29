import { Key } from "./key";

class Keyboard {

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

  findAssignedKey(code) {
    for (const  assignedKey of [...this.assignedLightKeys, ...this.assignedDarkKeys]) {
      if (assignedKey.code === code) {
        return assignedKey;
      }
    }
  }
}

const defaultKeyboard = new Keyboard();

window.addEventListener('keydown', (event) => {
  if (!defaultKeyboard.activeAssignedKey) {
    if (event.repeat) {
      return;
    }
    const assignedKey = defaultKeyboard.findAssignedKey(event.code);
    if (assignedKey) {
      assignedKey.element.dispatchEvent(new MouseEvent('mousedown'));
      assignedKey.element.classList.add('active');
      defaultKeyboard.activeAssignedKey = assignedKey;
    }
  }
});

window.addEventListener('keyup', (event) => {
  if (defaultKeyboard.activeAssignedKey && defaultKeyboard.activeAssignedKey.code === event.code) {
    const assignedKey = defaultKeyboard.findAssignedKey(event.code);
    if (assignedKey) {
      assignedKey.element.classList.remove('active');
      defaultKeyboard.activeAssignedKey = undefined;
    }
  }
});

export { defaultKeyboard as keyboard }