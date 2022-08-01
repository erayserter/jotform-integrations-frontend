import App from "../App";
import Action from "./Action";
import Select from "./fields/Select";
import TagInput from "./fields/TagInput";
import Jotform from "./Jotform";
import Field from "./Field";

const ID = 2;
const NAME = "Telegram";
const URL = "https://img.icons8.com/color/480/000000/telegram-app--v1.png";
const TRIGGERS = [];
const ACTIONS = [
  new Action("Send Message", [
    new Field("Chat ID", "chat_id", "input", "8576375"),
    new TagInput("Text", "text"),
  ]),
  new Action("Send Attachments", [
    new Field("Chat ID", "chat_id", "input", "8576375"),
    new Select("File Upload Field", "upload_fields", true),
  ]),
];
const IS_OAUTH = false;

export default class Telegram extends App {
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

  getOptionFromSelection(datas, selection, type, requiredInfo) {
    const allTypeData = datas;
    switch (selection) {
      case "text":
        return Jotform.getFormTagInputOptions(allTypeData, requiredInfo);
      case "upload_fields":
        return Jotform.getFileUploadFieldsOptions(allTypeData, requiredInfo);
      default:
        return;
    }
  }

  prepareData(data) {
    return data;
  }
}
