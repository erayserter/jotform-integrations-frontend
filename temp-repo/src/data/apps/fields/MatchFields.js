import Field from "../Field";

const TYPE = "matchFields";

export default class MatchFields extends Field {
  constructor(label, selection, dependantFieldList) {
    super(label, selection, TYPE, dependantFieldList);
  }
}
