import App from "../App";
import Action from "./Action";
import Select from "./fields/Select";
import TagInput from "./fields/TagInput";
import Field from "./Field";

const ID = "Excell";
const NAME = "Microsoft Excell";
const URL = "https://img.icons8.com/color/480/000000/telegram-app--v1.png";
const TRIGGERS = [];
const ACTIONS = [
  new Action("Add Row to Table", [
    new Select("Choose a Workbook", "workbook_id", [], false),
    new Select("Choose a Form Fields", "space", [], true),
    new Field("Chat ID", "chat_id", "input", [], "8576375"),
    new TagInput("Text", "text", []),
  ]),
];
const IS_OAUTH = true;

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

  getOptionFromSelection(
    datas,
    selection,
    actionName,
    type,
    authenticationInfo,
    requiredInfo,
    dependantApp
  ) {
    const allTypeData = datas;
    switch (selection) {
      case "text":
      default:
        return;
    }
  }

  prepareData(data) {
    return data;
  }
}
