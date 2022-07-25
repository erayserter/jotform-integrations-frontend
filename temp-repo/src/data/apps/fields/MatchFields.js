import Field from "../Field";

const TYPE = "matchFields";

export default class MatchFields extends Field {
  constructor(label, selection) {
    super(label, selection, TYPE);
  }
}
