export default class App {
  id;
  name;
  img;
  actions;
  isOauth;

  constructor(appObject) {
    this.id = appObject.id;
    this.name = appObject.name;
    this.img = appObject.img;
    this.actions = appObject.actions;
    this.isOauth = appObject.isOauth;
  }

  init(datas, actionName, type, requiredInfo) {
    let options = {};
    this.addAllOptions(options, datas, actionName, type, requiredInfo);
    return options;
  }

  addAllOptions(options, datas, actionName, type, requiredInfo) {
    const action = this.actions.find(
      (action) => action.getName() === actionName
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
}
