import Field from "../Field";

const TYPE = "select";

export default class Select extends Field {
  isMulti;

  constructor(label, selection, isMulti) {
    super(label, selection, TYPE);

    this.isMulti = isMulti;
  }
}
