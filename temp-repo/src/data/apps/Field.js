export default class Field {
  label;
  selection;
  templateDefault;

  constructor(label, selection, templateDefault = undefined) {
    this.label = label;
    this.selection = selection;
    this.templateDefault = templateDefault;
  }

  getSelection() {
    return this.selection;
  }
}
