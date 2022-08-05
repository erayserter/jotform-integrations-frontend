import App from "../App";
import Action from "./Action";
import Select from "./fields/Select";
import MatchFields from "./fields/MatchFields";
import TagInput from "./fields/TagInput";
import { isNil } from "lodash";

const ID = "ClickUp";
const NAME = "ClickUp";
const URL =
  "https://files.jotform.com/jotformapps/cde74cfb4f0ca88ebc50767e1e211553.png";
const TRIGGERS = [];
const ACTIONS = [
  new Action("Create Task", [
    new Select(
      "Choose a Workspace",
      "workspace",
      ["space", "folder", "list_id", "match_fields"],
      false
    ),
    new Select(
      "Choose a Space",
      "space",
      ["folder", "list_id", "match_fields"],
      false
    ),
    new Select("Choose a Folder", "folder", ["list_id", "match_fields"], false),
    new Select("Choose a List", "list_id", ["match_fields"], false),
    new MatchFields("Match Your Fields", "match_fields", []),
  ]),
  new Action("Create Subtask", [
    new Select(
      "Choose a Workspace",
      "workspace",
      ["space", "folder", "list_id", "task", "match_fields"],
      false
    ),
    new Select(
      "Choose a Space",
      "space",
      ["folder", "list_id", "task", "match_fields"],
      false
    ),
    new Select(
      "Choose a Folder",
      "folder",
      ["list_id", "task", "match_fields"],
      false
    ),
    new Select("Choose a List", "list_id", ["task", "match_fields"], false),
    new Select("Choose a Task", "task", ["match_fields"], false),
    new MatchFields("Match Your Fields", "match_fields", []),
  ]),
  new Action("Create Comment", [
    new Select(
      "Choose a Workspace",
      "workspace",
      ["space", "folder", "list_id", "task", "comment"],
      false
    ),
    new Select(
      "Choose a Space",
      "space",
      ["folder", "list_id", "task", "comment"],
      false
    ),
    new Select(
      "Choose a Folder",
      "folder",
      ["list_id", "task", "comment"],
      false
    ),
    new Select("Choose a List", "list_id", ["task", "comment"], false),
    new Select("Choose a Task", "task", ["comment"], false),
    new TagInput("Enter a Comment", "comment", []),
  ]),
];
const IS_OAUTH = true;

export default class ClickUp extends App {
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
    const requiredInfoSelectedType = requiredInfo[type];
    switch (selection) {
      case "workspace":
        return this.getWorkspaceOptions(datas, type, authenticationInfo);
      case "space":
        if (requiredInfoSelectedType.workspace != null)
          return this.getSpaceOptions(
            datas,
            type,
            authenticationInfo,
            requiredInfoSelectedType.workspace
          );
        return [];
      case "folder":
        if (requiredInfoSelectedType.space != null)
          return this.getFolderOptions(
            datas,
            type,
            authenticationInfo,
            requiredInfoSelectedType.space
          );
        return [];
      case "list_id":
        if (requiredInfoSelectedType.folder != null)
          return this.getListOptions(
            datas,
            type,
            authenticationInfo,
            requiredInfoSelectedType
          );
        return [];
      case "task":
        if (requiredInfoSelectedType.list_id != null)
          return this.getTaskOptions(
            datas,
            type,
            authenticationInfo,
            requiredInfoSelectedType.list_id
          );
        return [];
      case "match_fields":
        if (
          requiredInfoSelectedType.list_id != null &&
          (actionName !== "Create Subtask" ||
            requiredInfoSelectedType.task != null)
        )
          return this.getMatchFieldOptions(
            datas,
            type,
            authenticationInfo,
            requiredInfo,
            dependantApp
          );
        return { source: [], destination: [] };
      case "comment":
        if (requiredInfoSelectedType.task != null)
          return dependantApp.getFormTagInputOptions(
            datas,
            authenticationInfo,
            requiredInfo
          );
        return [];
      default:
        return;
    }
  }

  async getWorkspaceOptions(datas, type, authenticationInfo) {
    const workspaceOptions = [];
    let datasCopy = { ...datas };

    if (isNil(this.getWorkspaces(datas[type])))
      datasCopy = {
        ...datasCopy,
        [type]: {
          ...datasCopy[type],
          workspace: await this.fetchData(authenticationInfo, "getWorkspaces"),
        },
      };

    const workspaces = this.getWorkspaces(datasCopy[type]);
    for (const workspace of workspaces)
      workspaceOptions.push({
        value: workspace.id,
        label: workspace.name,
      });

    return { fieldOption: workspaceOptions, newDatas: datasCopy };
  }

  async getSpaceOptions(datas, type, authenticationInfo, workspace) {
    const spaceOptions = [];
    let datasCopy = { ...datas };

    if (isNil(this.getSpaces(datasCopy[type])))
      datasCopy = {
        ...datasCopy,
        [type]: {
          ...datasCopy[type],
          space: await this.fetchData(
            authenticationInfo,
            "getSpaces",
            workspace
          ),
        },
      };

    const spaces = this.getSpaces(datasCopy[type]);
    for (const space of spaces)
      spaceOptions.push({
        value: space.id,
        label: space.name,
      });

    return { fieldOption: spaceOptions, newDatas: datasCopy };
  }

  async getFolderOptions(datas, type, authenticationInfo, space) {
    const folderOptions = [];
    let datasCopy = { ...datas };

    if (isNil(this.getFolders(datas[type])))
      datasCopy = {
        ...datasCopy,
        [type]: {
          ...datasCopy[type],
          folder: await this.fetchData(authenticationInfo, "getFolders", space),
        },
      };

    const folders = this.getFolders(datasCopy[type]);
    for (const folder of folders)
      folderOptions.push({
        value: folder.id,
        label: folder.name,
      });

    return { fieldOption: folderOptions, newDatas: datasCopy };
  }

  async getListOptions(datas, type, authenticationInfo, requiredInfo) {
    const listOptions = [];
    let datasCopy = { ...datas };

    const action =
      requiredInfo.folder === 0 ? "getFolderlessLists" : "getLists";
    const id =
      requiredInfo.folder === 0 ? requiredInfo.space : requiredInfo.folder;

    if (isNil(this.getLists(datas[type])))
      datasCopy = {
        ...datasCopy,
        [type]: {
          ...datasCopy[type],
          list_id: await this.fetchData(authenticationInfo, action, id),
        },
      };

    const lists = this.getLists(datasCopy[type]);
    for (const list of lists)
      listOptions.push({
        value: list.id,
        label: list.name,
      });

    return { fieldOption: listOptions, newDatas: datasCopy };
  }

  async getTaskOptions(datas, type, authenticationInfo, list) {
    const taskOptions = [];
    let datasCopy = { ...datas };

    if (isNil(this.getTasks(datas)))
      datasCopy = {
        ...datasCopy,
        [type]: {
          ...datasCopy[type],
          task: await this.fetchData(authenticationInfo, "getTasks", list),
        },
      };

    const tasks = this.getTasks(datasCopy[type]);
    for (const task of tasks)
      taskOptions.push({
        value: task.id,
        label: task.name,
      });

    return { fieldOption: taskOptions, newDatas: datasCopy };
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
        { value: "name", label: "Name" },
        { value: "description", label: "Description" },
        { value: "priority", label: "Priority" },
        { value: "status", label: "Status" },
      ],
      predefined: {
        priority: [
          { value: "urgent", label: "Urgent" },
          { value: "high", label: "High" },
          { value: "normal", label: "Normal" },
          { value: "low", label: "Low" },
        ],
        status: [
          { value: "todo", label: "TO DO" },
          { value: "complete", label: "COMPLETE" },
        ],
      },
    };

    const { formFieldOptions, newDatas: sourceDatas } =
      await dependantApp.getFormFieldOptions(
        datas,
        authenticationInfo,
        requiredInfo
      );

    const { fieldOptions, newDatas: destinationDatas } =
      await this.getFieldOptions(
        datas,
        type,
        authenticationInfo,
        requiredInfo[type].list_id
      );

    matchFieldOptions = {
      ...matchFieldOptions,
      destination: [...matchFieldOptions.destination, ...fieldOptions],
      source: formFieldOptions,
    };

    const newDatas = {
      source: sourceDatas.source,
      destination: destinationDatas.destination,
    };

    return { fieldOption: matchFieldOptions, newDatas };
  }

  async getFieldOptions(datas, type, authenticationInfo, listId) {
    const fieldOptions = [];
    let datasCopy = { ...datas };

    if (isNil(this.getAccountFields(datas[type])))
      datasCopy = {
        ...datasCopy,
        [type]: {
          ...datasCopy[type],
          match_fields: await this.fetchData(
            authenticationInfo,
            "getCustomFields",
            listId
          ),
        },
      };

    const fields = this.getAccountFields(datasCopy[type]);

    for (const field of fields)
      fieldOptions.push({
        value: field.id,
        label: field.name,
      });

    return { fieldOptions, newDatas: datasCopy };
  }

  getWorkspaces(datas) {
    return datas.workspace;
  }

  getSpaces(datas) {
    return datas.space;
  }

  getFolders(datas) {
    return datas.folder;
  }

  getLists(datas) {
    return datas.list_id;
  }

  getTasks(datas) {
    return datas.task;
  }

  getAccountFields(datas) {
    return datas.match_fields;
  }

  fetchData(authenticationInfo, action, requiredSelection) {
    const authId = authenticationInfo[this.id].authId;
    const body = {
      action: action,
      auth_user_id: authId,
      id: requiredSelection,
    };
    return this.fetchDataFromBackend(body);
  }

  prepareData(data) {
    return data;
  }
}
