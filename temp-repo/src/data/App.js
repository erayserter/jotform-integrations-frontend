export default class App {
  id;
  name;
  url;
  actions;
  triggers;
  isOauth;

  constructor(appObject) {
    this.id = appObject.id;
    this.name = appObject.name;
    this.url = appObject.url;
    this.triggers = appObject.triggers;
    this.actions = appObject.actions;
    this.isOauth = appObject.isOauth;
  }

  init(datas, actionName, type, requiredInfo) {
    let options = {};
    this.addAllOptions(options, datas, actionName, type, requiredInfo);
    return options;
  }

  addAllOptions(options, datas, actionName, type, requiredInfo) {
    let action = this.actions.find((action) => action.getName() === actionName);

    if (!action)
      action = this.triggers.find(
        (trigger) => trigger.getName() === actionName
      );

    for (const field of action.getAllFields()) {
      const selection = field.getSelection();
      const fieldOption = this.getOptionFromSelection(
        datas,
        selection,
        type,
        requiredInfo
      );
      this.addOption(options, selection, fieldOption);
    }
  }

  addOption(options, selection, optionData) {
    options[selection] = optionData;
  }

  getFields(type, actName) {
    const selectedAct = (a) => a.name === actName;
    const actArray = (actType) =>
      type === "source" ? this.triggers : this.actions;

    return actArray(type).find(selectedAct).getAllFields();
  }
}
