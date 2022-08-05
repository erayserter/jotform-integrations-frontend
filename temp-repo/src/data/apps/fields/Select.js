import Field from "../Field";

const TYPE = "select";

export default class Select extends Field {
  isMulti;

  constructor(label, selection, dependantFieldList, isMulti) {
    super(label, selection, TYPE, dependantFieldList);

    this.isMulti = isMulti;
  }
}
