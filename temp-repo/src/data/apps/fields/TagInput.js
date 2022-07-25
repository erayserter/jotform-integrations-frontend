import Field from "../Field";

const TYPE = "tagInput";

export default class TagInput extends Field {
  constructor(label, selection) {
    super(label, selection, TYPE);
  }
}
