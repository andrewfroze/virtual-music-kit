class Melody {

    constructor() {
        this.editMode = false;
        this.notes = [];
    }

    push(note) {
        this.notes.push(note);
    }
}

export { Melody }