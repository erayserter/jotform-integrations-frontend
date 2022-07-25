export default class Field {
  label;
  selection;
  type;
  templateDefault;

  constructor(label, selection, type, templateDefault = undefined) {
    this.label = label;
    this.selection = selection;
    this.type = type;
    this.templateDefault = templateDefault;
  }

  getSelection() {
    return this.selection;
  }
}
