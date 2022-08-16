import { isEmpty } from "lodash";
import App from "../App";
import Action from "./Action";
import Select from "./fields/Select";
import { isNil } from "lodash";

const ID = "Jotform";
const NAME = "Jotform";
const URL =
  "https://www.jotform.com/resources/assets/svg/jotform-icon-transparent.svg";
const TRIGGERS = [
  new Action("Get Submission", [
    new Select("Choose Form", "form_id", [], false),
  ]),
];
const ACTIONS = [];
const IS_OAUTH = false;
const PREFILLS = [new Select("Choose Form", "form_id", [], false)];

export default class Jotform extends App {
  constructor() {
    super({
      id: ID,
      name: NAME,
      url: URL,
      triggers: TRIGGERS,
      actions: ACTIONS,
      isOauth: IS_OAUTH,
      prefills: PREFILLS,
    });
  }

  getOptionFromSelection(
    datas,
    selection,
    actionName,
    type,
    authenticationInfo
  ) {
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
      newDatas = {
        ...newDatas,
        [type]: await this.fetchFormHeaders(authenticationInfo),
      };

    for (const formId in newDatas[type])
      titleOptions.push({
        value: formId,
        label: this.getTitle(newDatas[type], formId),
      });

    return { fieldOption: titleOptions, newDatas };
  }

  async getFormFieldOptions(datas, authenticationInfo, options) {
    let formFieldOptions = [];
    let datasCopy = { ...datas };
    let formId = options.source.form_id;

    if (isNil(datas.source[formId].fields)) {
      datasCopy = {
        ...datasCopy,
        source: {
          ...datasCopy.source,
          [formId]: (await this.fetchFormInfo(authenticationInfo, formId))[
            formId
          ],
        },
      };
    }

    const fields = this.getFormFields(datasCopy.source, formId);
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

    return { formFieldOptions, newDatas: datasCopy };
  }

  getFormSubfieldOptions(fieldId, field) {
    let formSubfieldOptions = [];
    for (const subfieldId in field.subfields) {
      formSubfieldOptions.push({
        value: fieldId + ":" + subfieldId,
        label: field.field_name + " - " + field.subfields[subfieldId],
      });
    }

    return formSubfieldOptions;
  }

  async getFormTagInputOptions(datas, authenticationInfo, options) {
    let tagInputOptions = [];

    const { formFieldOptions, newDatas } = await this.getFormFieldOptions(
      datas,
      authenticationInfo,
      options
    );

    tagInputOptions = await this.getOptionsInTagInputForm(formFieldOptions);

    return { fieldOption: tagInputOptions, newDatas };
  }

  getOptionsInTagInputForm(formFieldOptions) {
    return formFieldOptions.map((field) => {
      return { id: field.value, value: field.label };
    });
  }

  async getFileUploadFieldsOptions(datas, authenticationInfo, options) {
    let fileUploadFieldsOptions = [];
    let datasCopy = { ...datas };
    const formId = options.source.form_id;

    if (isNil(this.getUploadFields(datas.source, formId))) {
      datasCopy = {
        ...datasCopy,
        source: {
          ...datasCopy.source,
          [formId]: (await this.fetchFormInfo(authenticationInfo, formId))[
            formId
          ],
        },
      };
    }

    const fields = this.getUploadFields(datasCopy.source, formId);

    for (const fieldId in fields)
      fileUploadFieldsOptions.push({
        value: fieldId,
        label: fields[fieldId].field_name,
      });

    return { fieldOption: fileUploadFieldsOptions, newDatas: datasCopy };
  }

  getTitle(datas, formId) {
    return datas[formId].title;
  }

  getFormFields(datas, formId) {
    return datas[formId].fields;
  }

  getUploadFields(datas, formId) {
    return datas[formId].file_upload_fields;
  }

  fetchFormHeaders(authenticationInfo) {
    const apiKey = authenticationInfo[this.id].apiKey;
    const body = {
      action: "getAllFormInfo",
      apiKey: apiKey,
    };
    return this.fetchDataFromBackend(body);
  }

  fetchFormInfo(authenticationInfo, formId) {
    const apiKey = authenticationInfo[this.id].apiKey;
    const body = {
      action: "getFormInfo",
      apiKey: apiKey,
      formId: formId,
    };
    return this.fetchDataFromBackend(body);
  }
}
