import App from "../App";
import Action from "./Action";
import TagInput from "./fields/TagInput";
import Select from "./fields/Select";
import MatchFields from "./fields/MatchFields";
import { cloneDeep, stubString } from "lodash";
import { isNil } from "lodash";
import Jotform from "./Jotform";

const ID = "GoogleContacts";
const NAME = "Google Contacts";
const URL =
  "https://files.jotform.com/jotformapps/fa7716f93e1a40894d4ea2ab704842d1.png";
const TRIGGERS = [];
const ACTIONS = [
  new Action("Create Contact", [
    new MatchFields(
      "Match Your Fields",
      "match_fields",
      { source: "select", destination: "select" },
      []
    ),
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
      case "match_fields":
        return this.getMatchFieldOptions(
          datas,
          type,
          authenticationInfo,
          requiredInfo,
          dependantApp
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

  async getMatchFieldOptions(
    datas,
    type,
    authenticationInfo,
    requiredInfo,
    dependantApp
  ) {
    let matchFieldOptions = {
      source: [],
      destination: [
        { value: "givenName", label: "First Name" },
        { value: "familyName", label: "Family Name" },
        { value: "emailAddress", label: "Email" },
        { value: "phoneNumber", label: "Phone Number" },
      ],
      predefined: {},
    };

    const { formFieldOptions, newDatas: sourceDatas } =
      await dependantApp.getFormFieldOptions(
        datas,
        authenticationInfo,
        requiredInfo
      );

    matchFieldOptions = {
      ...matchFieldOptions,
      destination: [...matchFieldOptions.destination],
      source: formFieldOptions,
    };

    const newDatas = {
      source: sourceDatas.source,
      destination: datas.destination,
    };

    return { fieldOption: matchFieldOptions, newDatas };
  }

  prepareDataServerSide(data) {
    const dataCopy = cloneDeep(data);
    const matchFields = data.destination.settings.match_fields;
    dataCopy.destination.settings = {
      contact_information: {
        names: Object.keys(matchFields).find(
          (key) =>
            matchFields[key] === "givenName" ||
            matchFields[key] === "familyName"
        ) && {
          givenName: Object.keys(matchFields).find(
            (key) => matchFields[key] === "givenName"
          ),
          familyName: Object.keys(matchFields).find(
            (key) => matchFields[key] === "familyName"
          ),
        },
        emailAddresses: Object.keys(matchFields).find(
          (key) => matchFields[key] === "emailAddress"
        ) && {
          value: Object.keys(matchFields).find(
            (key) => matchFields[key] === "emailAddress"
          ),
        },
        phoneNumbers: Object.keys(matchFields).find(
          (key) => matchFields[key] === "phoneNumber"
        ) && {
          value: Object.keys(matchFields).find(
            (key) => matchFields[key] === "phoneNumber"
          ),
        },
      },
    };
    return dataCopy;
  }

  prepareDataClientSide(data) {
    const newData = {
      ...data,
      destination: {
        ...data.destination,
        settings: {
          match_fields: {
            ...(data.destination.settings.contact_information.names
              ?.givenName && {
              [data.destination.settings.contact_information.names?.givenName]:
                "givenName",
            }),
            ...(data.destination.settings.contact_information.names
              ?.familyName && {
              [data.destination.settings.contact_information.names?.familyName]:
                "familyName",
            }),
            ...(data.destination.settings.contact_information.emailAddresses
              ?.value && {
              [data.destination.settings.contact_information.emailAddresses
                ?.value]: "emailAddress",
            }),
            ...(data.destination.settings.contact_information.phoneNumbers
              ?.value && {
              [data.destination.settings.contact_information.phoneNumbers
                ?.value]: "phoneNumber",
            }),
          },
        },
      },
    };

    return newData;
  }
}
