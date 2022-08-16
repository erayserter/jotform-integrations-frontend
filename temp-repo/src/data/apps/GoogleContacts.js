import App from "../App";
import Action from "./Action";
import TagInput from "./fields/TagInput";
import Select from "./fields/Select";
import { cloneDeep } from "lodash";
import Jotform from "./Jotform";

const ID = "GoogleContacts";
const NAME = "Google Contacts";
const URL =
  "https://files.jotform.com/jotformapps/fa7716f93e1a40894d4ea2ab704842d1.png";
const TRIGGERS = [];
const ACTIONS = [
  new Action("Create Contact", [
    new TagInput("First Name", "givenName", []),
    new TagInput("Family Name", "familyName", []),
    new TagInput("Email", "emailAddress", []),
    new TagInput("Phone Number", "phoneNumber", []),
  ]),
];
const IS_OAUTH = true;
const PREFILLS = [new Select("Choose Contacts", "contactChoices", [], true)];

export default class GoogleContacts extends App {
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
    authenticationInfo,
    requiredInfo = {},
    dependantApp = new Jotform()
  ) {
    switch (selection) {
      case "givenName":
      case "familyName":
      case "emailAddress":
      case "phoneNumber":
        return dependantApp.getFormTagInputOptions(
          datas,
          authenticationInfo,
          requiredInfo
        );
      case "contactChoices":
        return dependantApp.getFormTitleOptions(
          datas,
          "source",
          authenticationInfo
        );
      default:
        return;
    }
  }

  prepareDataServerSide(data) {
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

  prepareDataClientSide(data) {
    return {
      ...data,
      destination: {
        ...data.destination,
        settings: {
          givenName:
            data.destination.settings.contact_information.names.givenName,
          familyName:
            data.destination.settings.contact_information.names.familyName,
          emailAddress:
            data.destination.settings.contact_information.emailAddresses.value,
          phoneNumber:
            data.destination.settings.contact_information.phoneNumbers.value,
        },
      },
    };
  }
}
