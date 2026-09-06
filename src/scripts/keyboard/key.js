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
    return parseKeyLabel(this.code);
  }
}

function parseKeyLabel(code) {
  return code.replace("Key", "").replace("Digit", "");
}

export { Key, parseKeyLabel };
