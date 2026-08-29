class Key {

  constructor(code, element = undefined) {
    this.code = code;
    this.element = element;
  }

  setNewKey(newKey) {
    this.key = newKey;
  }

  assignNewElement(newElement) {
    this.element = newElement;
  }

  getKeyLabel() {
    return this.code.replace('Key', '').replace('Digit', '');
  }
}

export { Key }