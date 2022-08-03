import { isEmpty } from "lodash";
import configurations from "../../config";
import App from "../App";
import Action from "./Action";
import Select from "./fields/Select";

const ID = "Jotform";
const NAME = "Jotform";
const URL =
  "https://www.jotform.com/resources/assets/svg/jotform-icon-transparent.svg";
const TRIGGERS = [
  new Action("Get Submission", [new Select("Choose Form", "form_id", false)]),
];
const ACTIONS = [];
const IS_OAUTH = false;

export default class Jotform extends App {
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

  getOptionFromSelection(datas, selection, type, authenticationInfo) {
    switch (selection) {
      case "form_id":
        return this.getFormTitleOptions(datas, type, authenticationInfo);
      default:
        return;
    }
  }

  async getFormTitleOptions(datas, type, authenticationInfo) {
    let titleOptions = [];
    let newDatas = { ...datas };
    if (isEmpty(datas[type]))
      newDatas[type] = await this.fetchFormHeaders(authenticationInfo);
    console.log("function return etti");

    for (const formId in newDatas[type])
      titleOptions.push({
        value: formId,
        label: this.getTitle(newDatas[type], formId),
      });

    return { fieldOption: titleOptions, newDatas };
  }

  static getFormFieldOptions(datas, options) {
    let formFieldOptions = [];
    const fields = this.getFormFields(datas.source, options.source.form_id);
    for (const fieldId in fields) {
      formFieldOptions.push({
        value: fieldId,
        label: fields[fieldId].field_name,
      });
      formFieldOptions = [
        ...formFieldOptions,
        ...this.getFormSubfieldOptions(fieldId, fields[fieldId]),
      ];
    }
    return formFieldOptions;
  }

  static getFormSubfieldOptions(fieldId, field) {
    let formSubfieldOptions = [];
    for (const subfieldId in field.subfields) {
      formSubfieldOptions.push({
        value: fieldId + ":" + subfieldId,
        label: field.field_name + " - " + field.subfields[subfieldId],
      });
    }
    return formSubfieldOptions;
  }

  static getFormTagInputOptions(datas, options) {
    let tagInputOptions = [];

    const formFieldOptions = this.getFormFieldOptions(datas, options);

    tagInputOptions = this.getOptionsInTagInputForm(formFieldOptions);
    return tagInputOptions;
  }

  static getOptionsInTagInputForm(formFieldOptions) {
    return formFieldOptions.map((field) => {
      return { id: field.value, value: field.label };
    });
  }

  static getFileUploadFieldsOptions(datas, options) {
    let fileUploadFieldsOptions = [];
    const fields = this.getUploadFields(datas.source, options.source.formId);

    for (const fieldId in fields)
      fileUploadFieldsOptions.push({
        value: fieldId,
        label: fields[fieldId].field_name,
      });
    return fileUploadFieldsOptions;
  }

  getTitle(datas, formId) {
    return datas[formId].title;
  }

  static getFormFields(datas, formId) {
    return datas[formId].fields;
  }

  static getUploadFields(datas, formId) {
    return datas[formId].file_upload_fields;
  }

  fetchFormHeaders(authenticationInfo) {
    const apiKey = authenticationInfo.apiKey;
    const body = {
      action: "getAllFormInfo",
      apiKey: apiKey,
    };
    return this.fetchDataFromBackend(body);
  }

  async fetchDataFromBackend(body) {
    const responseContent = fetch(
      "https://" +
        configurations.DEV_RDS_NAME +
        ".jotform.dev/intern-api/jotform",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then((data) => data.json())
      .then((data) => data.content.content)
      .catch((err) => console.log(err));

    return responseContent;
  }

  prepareData(data) {
    return data;
  }
}
