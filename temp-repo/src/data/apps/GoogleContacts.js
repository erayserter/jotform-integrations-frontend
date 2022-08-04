import App from "../App";
import Action from "./Action";
import Jotform from "./Jotform";
import TagInput from "./fields/TagInput";
import { cloneDeep } from "lodash";

const ID = "GoogleContacts";
const NAME = "Google Contacts";
const URL =
  "https://files.jotform.com/jotformapps/fa7716f93e1a40894d4ea2ab704842d1.png";
const TRIGGERS = [];
const ACTIONS = [
  new Action("Create Contact", [
    new TagInput("First Name", "givenName"),
    new TagInput("Family Name", "familyName"),
    new TagInput("Email", "emailAddress"),
    new TagInput("Phone Number", "phoneNumber"),
  ]),
];
const IS_OAUTH = true;

export default class GoogleContacts extends App {
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
    requiredInfo = {},
    dependantApp
  ) {
    const allTypeData = datas;
    switch (selection) {
      case "givenName":
      case "familyName":
      case "emailAddress":
      case "phoneNumber":
        return dependantApp.getFormTagInputOptions(
          allTypeData,
          authenticationInfo,
          requiredInfo
        );
      default:
        return;
    }
  }

  prepareData(data) {
    const dataCopy = cloneDeep(data);
    dataCopy.destination.settings = {
      contact_information: {
        names: {
          givenName: data.destination.settings.givenName,
          familyName: data.destination.settings.familyName,
        },
        emailAddresses: { value: data.destination.settings.emailAddress },
        phoneNumbers: { value: data.destination.settings.phoneNumber },
      },
    };
    return dataCopy;
  }
}
