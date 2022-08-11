import App from "../App";
import Action from "./Action";
import Select from "./fields/Select";
import Field from "./Field";
import MatchFields from "./fields/MatchFields";
import { isNil } from "lodash";

const ID = "Excel";
const NAME = "Microsoft Excel";
const URL = "/intern/src/assets/excel.svg";
const TRIGGERS = [];
const ACTIONS = [
  new Action("Add Row to Table", [
    new Field("Worksheet Name", "worksheet_name", "input", []),
    new Select("Choose a Workbook", "workbook_id", [], false),
    new MatchFields(
      "Match Table Columns With Form Fields",
      "fields",
      { source: "select", destination: "input" },
      []
    ),
    new Field(
      "Update table row on form submission edit",
      "edit",
      "checkbox",
      []
    ),
    new Field("Add Old Submissions", "add_old_submissions", "checkbox", []),
  ]),
];
const IS_OAUTH = true;

export default class Excel extends App {
  constructor() {
    super({
      id: ID,
      name: NAME,
      url: URL,
      triggers: TRIGGERS,
      actions: ACTIONS,
      isOauth: IS_OAUTH,
    });
  }

  getOptionFromSelection(
    datas,
    selection,
    actionName,
    type,
    authenticationInfo,
    requiredInfo,
    dependantApp
  ) {
    switch (selection) {
      case "workbook_id":
        return this.getWorkbookOptions(datas, type, authenticationInfo);
      case "fields":
        return this.getFormFields(
          datas,
          authenticationInfo,
          dependantApp,
          requiredInfo
        );
      case "edit":
      case "add_old_submissions":
      default:
        return;
    }
  }

  async getWorkbookOptions(datas, type, authenticationInfo) {
    let datasCopy = { ...datas };

    if (isNil(this.getWorkbooks(datas[type])))
      datasCopy = {
        ...datasCopy,
        [type]: {
          ...datasCopy[type],
          workbooks: await this.fetchData(authenticationInfo, "getWorkbooks"),
        },
      };

    const workbooks = this.getWorkbooks(datasCopy[type]);

    const options = workbooks.map((workbook) => ({
      value: workbook.id,
      label: workbook.name,
    }));

    return { fieldOption: options, newDatas: datasCopy };
  }

  async getFormFields(datas, authenticationInfo, dependantApp, requiredInfo) {
    const { formFieldOptions, newDatas } =
      await dependantApp.getFormFieldOptions(
        datas,
        authenticationInfo,
        requiredInfo
      );

    const fieldOption = {
      source: formFieldOptions,
      destination: [],
      predefined: [],
    };

    return { fieldOption, newDatas };
  }

  getWorkbooks(datas) {
    return datas.workbooks;
  }

  fetchData(authenticationInfo, action) {
    const authId = authenticationInfo[this.id].authId;
    const body = {
      action: action,
      auth_user_id: authId,
    };
    return this.fetchDataFromBackend(body);
  }

  prepareData(data) {
    return {
      ...data,
      destination: {
        ...data.destination,
        settings: {
          ...data.destination.settings,
          fields: undefined,
          edit: data.destination.settings.edit ? 1 : 0,
          add_old_submissions: data.destination.settings.add_old_submissions
            ? 1
            : 0,
          selected_fields: Object.keys(data.destination.settings.fields).map(
            (field) => ({
              form_field_id: field,
              form_field_name: data.destination.settings.fields[field],
            })
          ),
        },
      },
    };
  }
}
