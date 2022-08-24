import App from "../App";
import Action from "./Action";
import TagInput from "./fields/TagInput";
import Select from "./fields/Select";
import Field from "./Field";
import MatchFields from "./fields/MatchFields";
import { cloneDeep } from "lodash";
import { isNil } from "lodash";
import Jotform from "./Jotform";
import configurations from "../../config";

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
const PREFILLS = [
  new Field(
    "Prefill Title",
    "prefill_title",
    "input",
    [],
    "Template Prefill Title"
  ),
  new Field("Your Email", "email", "input", []),
  new MatchFields(
    "Match Your Fields",
    "matchContactFields",
    { source: "select", destination: "select" },
    []
  ),
  new Select("Should be filled fields editable", "fieldBehaviour", [], false),
  new Select("Choose Contacts", "contactChoices", [], true),
];

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
      case "matchContactFields":
        return this.getMatchFieldOptions(
          datas,
          type,
          authenticationInfo,
          requiredInfo,
          dependantApp,
          actionName
        );
      case "contactChoices":
        return this.getContactOptions(datas, type, authenticationInfo);
      case "fieldBehaviour":
        return {
          fieldOption: [
            { value: "edit", label: "Editable" },
            { value: "readonly", label: "Read-only" },
          ],
          newDatas: datas,
        };
      default:
        return;
    }
  }

  async getContactOptions(datas, type, authenticationInfo) {
    const contactOptions = [];
    let datasCopy = { ...datas };

    if (isNil(this.getContacts(datas[type])))
      datasCopy = {
        ...datasCopy,
        [type]: {
          ...datasCopy[type],
          contacts: await this.fetchData(authenticationInfo, "getContacts"),
        },
      };

    const contacts = this.getContacts(datasCopy[type]);
    for (const contact of contacts)
      contactOptions.push({
        value: contact.id,
        label: contact.name,
      });

    return { fieldOption: contactOptions, newDatas: datasCopy };
  }

  async getMatchFieldOptions(
    datas,
    type,
    authenticationInfo,
    requiredInfo,
    dependantApp,
    actionName
  ) {
    let matchFieldOptions = {
      source: [],
      destination: [
        { value: "names:givenName", label: "First Name" },
        { value: "names:familyName", label: "Family Name" },
        { value: "emailAddresses:value", label: "Email" },
        { value: "phoneNumbers:value", label: "Phone Number" },
      ],
      predefined: {},
    };

    const { formFieldOptions, newDatas: sourceDatas } =
      await dependantApp.getFormFieldOptions(
        datas,
        authenticationInfo,
        requiredInfo,
        actionName
      );

    matchFieldOptions = {
      ...matchFieldOptions,
      destination: [...matchFieldOptions.destination],
      source: formFieldOptions,
    };

    const newDatas = {
      ...datas,
      source: sourceDatas.source,
      destination: datas.destination,
    };

    return { fieldOption: matchFieldOptions, newDatas };
  }

  getContacts(datas) {
    return datas.contacts;
  }

  fetchData(authenticationInfo, action) {
    const authId = authenticationInfo[this.id].authId;
    const body = {
      action: action,
      auth_user_id: authId,
    };
    return this.fetchDataFromBackend(body);
  }

  async createPrefill(appSelections, settingsSelections) {
    const requestBody = {
      auth_user_id: appSelections.prefill.auth_id,
      api_key: appSelections.source.key,
      fieldBehaviour: settingsSelections.prefill.fieldBehaviour,
      email: settingsSelections.prefill.email,
      form_id: settingsSelections.source.form_id,
      matching_fields: Object.keys(
        settingsSelections.prefill.matchContactFields
      ).reduce(
        (array, element) => [
          ...array,
          { [element]: settingsSelections.prefill.matchContactFields[element] },
        ],
        []
      ),
      contact_ids: settingsSelections.prefill.contactChoices,
      prefill_title: settingsSelections.prefill.prefill_title,
    };

    const responseContent = fetch(
      "https://" +
        configurations.DEV_RDS_NAME +
        ".jotform.dev/intern-api/createPrefill",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((data) => data.json())
      .then((data) => data.content)
      .catch((err) => console.log(err));

    return responseContent;
  }

  prepareDataServerSide(data) {
    const dataCopy = cloneDeep(data);
    const matchFields = data.destination.settings.match_fields;
    dataCopy.destination.settings = {
      contact_information: {
        names: Object.keys(matchFields).find(
          (key) =>
            matchFields[key] === "names:givenName" ||
            matchFields[key] === "names:familyName"
        ) && {
          givenName: Object.keys(matchFields).find(
            (key) => matchFields[key] === "names:givenName"
          ),
          familyName: Object.keys(matchFields).find(
            (key) => matchFields[key] === "names:familyName"
          ),
        },
        emailAddresses: Object.keys(matchFields).find(
          (key) => matchFields[key] === "emailAddress:value"
        ) && {
          value: Object.keys(matchFields).find(
            (key) => matchFields[key] === "emailAddresses:value"
          ),
        },
        phoneNumbers: Object.keys(matchFields).find(
          (key) => matchFields[key] === "phoneNumber:value"
        ) && {
          value: Object.keys(matchFields).find(
            (key) => matchFields[key] === "phoneNumbers:value"
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
                "names:givenName",
            }),
            ...(data.destination.settings.contact_information.names
              ?.familyName && {
              [data.destination.settings.contact_information.names?.familyName]:
                "names:familyName",
            }),
            ...(data.destination.settings.contact_information.emailAddresses
              ?.value && {
              [data.destination.settings.contact_information.emailAddresses
                ?.value]: "emailAddresses:value",
            }),
            ...(data.destination.settings.contact_information.phoneNumbers
              ?.value && {
              [data.destination.settings.contact_information.phoneNumbers
                ?.value]: "phoneNumbers:value",
            }),
          },
        },
      },
    };

    return newData;
  }
}
