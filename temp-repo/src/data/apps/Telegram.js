import App from "../App";
import Action from "./Action";
import Select from "./fields/Select";
import TagInput from "./fields/TagInput";
import Jotform from "./Jotform";
import Field from "./Field";

const ID = 2;
const NAME = "Telegram";
const URL = "https://img.icons8.com/color/480/000000/telegram-app--v1.png";
const ACTIONS = [
  new Action("Send Message", [
    new Field("Chat ID", "chat_id", "8576375"),
    new TagInput("Text", "text"),
  ]),
  new Action("Send Attachments", [
    new Field("Chat ID", "chat_id", "8576375"),
    new Select("File Upload Field", "upload_fields", true),
  ]),
];
const IS_OAUTH = true;

export default class Telegram extends App {
  constructor() {
    super({
      id: ID,
      name: NAME,
      url: URL,
      actions: ACTIONS,
      isOauth: IS_OAUTH,
    });
  }

  getOptionFromSelection(datas, selection, type, requiredInfo) {
    const selectedTypeData = datas[type];
    const allTypeData = datas;
    switch (selection) {
      case "text":
        return Jotform.getFormTagInputOptions(allTypeData, requiredInfo);
      case "upload_fields":
        return Jotform.getFileUploadFieldsOptions(allTypeData, requiredInfo);
    }
  }
}
