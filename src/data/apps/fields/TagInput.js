import Field from "../Field";

const TYPE = "tagInput";

export default class TagInput extends Field {
  constructor(label, selection, dependantFieldList) {
    super(label, selection, TYPE, dependantFieldList);
  }
}
