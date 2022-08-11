import Field from "../Field";

const TYPE = "matchFields";

export default class MatchFields extends Field {
  inputTypes;

  constructor(label, selection, inputTypes, dependantFieldList) {
    super(label, selection, TYPE, dependantFieldList);

    this.inputTypes = inputTypes;
  }
}
