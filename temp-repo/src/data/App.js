import { cloneDeep, isNil } from "lodash";
import configurations from "../config";

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

  init(
    datas,
    actionName,
    type,
    authenticationInfo,
    requiredInfo,
    dependantApp
  ) {
    const options = {};

    return this.addAllOptions(
      options,
      datas,
      actionName,
      type,
      authenticationInfo,
      requiredInfo,
      dependantApp
    );
  }

  async addAllOptions(
    options,
    datas,
    actionName,
    type,
    authenticationInfo,
    requiredInfo,
    dependantApp
  ) {
    let action = this.actions.find((action) => action.getName() === actionName);

    if (!action)
      action = this.triggers.find(
        (trigger) => trigger.getName() === actionName
      );

    let optionsCopy = { ...options };
    let newDatas = { ...datas };

    for (const field of action.getAllFields()) {
      const selection = field.getSelection();
      const returnObject = await this.getOptionFromSelection(
        newDatas,
        selection,
        actionName,
        type,
        authenticationInfo,
        requiredInfo,
        dependantApp
      );

      if (
        !isNil(returnObject) &&
        !isNil(returnObject.newDatas) &&
        !isNil(returnObject.fieldOption)
      ) {
        newDatas = returnObject.newDatas;
        const fieldOption = returnObject.fieldOption;

        optionsCopy = this.addOption(optionsCopy, selection, fieldOption);
      }
    }

    return { newOptions: optionsCopy, newDatas: newDatas };
  }

  addOption(options, selection, optionData) {
    const newOptions = { ...options };
    newOptions[selection] = optionData;
    return newOptions;
  }

  getFields(type, actName) {
    const selectedAct = (a) => a.name === actName;
    const actArray = (actType) =>
      type === "source" ? this.triggers : this.actions;

    return actArray(type).find(selectedAct).getAllFields();
  }

  getDependantFields(action, id, type) {
    return action.getAllFields().find((field) => field.getSelection() === id)
      .dependantFieldList;
  }

  isSameApp(app) {
    return app.id === this.id;
  }

  authenticate(credentials) {
    if (this.isOauth) return this.getAllUserData(credentials);
    return this.validateApiKey(credentials);
  }

  async validateApiKey(credentials) {
    return fetch(
      "https://" +
        configurations.DEV_RDS_NAME +
        ".jotform.dev/intern-api/validateApiKey",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    ).then((data) => data.json());
  }

  async getAllUserData(credentials) {
    return fetch(
      "https://" +
        configurations.DEV_RDS_NAME +
        ".jotform.dev/intern-api/getAllUserData?app_name=" +
        credentials
    ).then((res) => res.json());
  }

  async fetchDataFromBackend(body) {
    const responseContent = fetch(
      "https://" +
        configurations.DEV_RDS_NAME +
        ".jotform.dev/intern-api/" +
        this.id.charAt(0).toLowerCase() +
        this.id.slice(1),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then((data) => data.json())
      .then((data) => data.content)
      .catch((err) => console.log(err));

    return responseContent;
  }
}
