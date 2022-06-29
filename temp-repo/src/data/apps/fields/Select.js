import Field from "../Field";

export default class Select extends Field {
  isMulti;

  constructor(label, selection, isMulti) {
    super(label, selection);

    this.isMulti = isMulti;
  }
}
