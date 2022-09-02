export default class Field {
  label;
  selection;
  type;
  dependantFieldList;
  templateDefault;

  constructor(
    label,
    selection,
    type,
    dependantFieldList,
    templateDefault = undefined
  ) {
    this.label = label;
    this.selection = selection;
    this.type = type;
    this.dependantFieldList = dependantFieldList;
    this.templateDefault = templateDefault;
  }

  getSelection() {
    return this.selection;
  }
}
