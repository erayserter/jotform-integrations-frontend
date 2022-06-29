export default class Action {
  name;
  fields;

  constructor(name, fields) {
    this.name = name;
    this.fields = fields;
  }

  getName() {
    return this.name;
  }

  getAllFields() {
    return this.fields;
  }
}
