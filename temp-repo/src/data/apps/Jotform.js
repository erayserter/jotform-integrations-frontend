import App from "../App";
import Action from "./Action";
import Select from "./fields/Select";

const ID = 1;
const NAME = "Jotform";
const URL = "https://img.icons8.com/color/480/000000/telegram-app--v1.png";
const ACTIONS = [
  new Action("Get Submission", [new Select("Choose Form", "form_id", false)]),
];
const IS_OAUTH = false;

export default class Jotform extends App {
  constructor() {
    super({
      id: ID,
      name: NAME,
      url: URL,
      actions: ACTIONS,
      isOauth: IS_OAUTH,
    });
  }

  getOptionFromSelection(datas, selection, type) {
    switch (selection) {
      case "form_id":
        return this.getFormTitleOptions(datas[type]);
    }
  }

  getFormTitleOptions(datas) {
    let titleOptions = [];
    for (const formId in datas)
      titleOptions.push({
        value: formId,
        label: this.getTitle(datas, formId),
      });
    return titleOptions;
  }

  static getFormFieldOptions(datas, options) {
    let formFieldOptions = [];
    const fields = this.getFormFields(datas.source, options.formId);
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
    const fields = this.getUploadFields(datas.source, options.formId);
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
}
