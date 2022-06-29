export default class Field {
  label;
  selection;
  defaultValue;

  constructor(label, selection, defaultValue = undefined) {
    this.label = label;
    this.selection = selection;
    this.defaultValue = defaultValue;
  }

  getSelection() {
    return this.selection;
  }
}
