class Melody {
  constructor(maxLength) {
    this.editMode = false;
    this.notes = [];
    this.maxLength = maxLength;
  }

  push(note) {
    if (this.notes.length < this.maxLength) {
      this.notes.push(note);
      return true;
    }
    return false;
  }
}

export { Melody };
