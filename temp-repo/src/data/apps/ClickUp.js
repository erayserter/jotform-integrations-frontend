import App from "../App";
import Action from "./Action";
import Jotform from "./Jotform";
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
    new Select("Choose a Workspace", "workspace", false),
    new Select("Choose a Space", "space", false),
    new Select("Choose a Folder", "folder", false),
    new Select("Choose a List", "list_id", false),
    new MatchFields("Match Your Fields", "match_fields"),
  ]),
  new Action("Create Subtask", [
    new Select("Choose a Workspace", "workspace", false),
    new Select("Choose a Space", "space", false),
    new Select("Choose a Folder", "folder", false),
    new Select("Choose a List", "list_id", false),
    new Select("Choose a Task", "task", false),
    new MatchFields("Match Your Fields", "match_fields"),
  ]),
  new Action("Create Comment", [
    new Select("Choose a Workspace", "workspace", false),
    new Select("Choose a Space", "space", false),
    new Select("Choose a Folder", "folder", false),
    new Select("Choose a List", "list_id", false),
    new Select("Choose a Task", "task", false),
    new TagInput("Enter a Comment", "comment"),
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
    type,
    authenticationInfo,
    requiredInfo = {}
  ) {
    const selectedTypeData = datas[type];
    const requiredInfoSelectedType = requiredInfo[type];
    const allTypeData = datas;
    switch (selection) {
      case "workspace":
        return this.getWorkspaceOptions(selectedTypeData, authenticationInfo);
      case "space":
        if (requiredInfoSelectedType.workspace != null)
          return this.getSpaceOptions(
            selectedTypeData,
            authenticationInfo,
            requiredInfoSelectedType
          );
        return [];
      case "folder":
        if (requiredInfoSelectedType.space != null)
          return this.getFolderOptions(
            selectedTypeData,
            authenticationInfo,
            requiredInfoSelectedType
          );
        return [];
      case "list_id":
        if (requiredInfoSelectedType.folder != null)
          return this.getListOptions(
            selectedTypeData,
            authenticationInfo,
            requiredInfoSelectedType
          );
        return [];
      case "task":
        if (requiredInfoSelectedType.list_id != null)
          return this.getTaskOptions(
            selectedTypeData,
            authenticationInfo,
            requiredInfoSelectedType
          );
        return [];
      case "match_fields":
        if (
          requiredInfoSelectedType.list != null &&
          (selection !== "Create Subtask" ||
            requiredInfoSelectedType.task != null)
        )
          return this.getMatchFieldOptions(allTypeData, requiredInfo);
        return { source: [], destination: [] };
      case "comment":
        if (requiredInfoSelectedType.task != null)
          return Jotform.getFormTagInputOptions(allTypeData, requiredInfo);
        return [];
      default:
        return;
    }
  }

  async getWorkspaceOptions(datas, authenticationInfo) {
    const workspaceOptions = [];
    let datasCopy = { ...datas };

    if (isNil(datas.workspaces))
      datasCopy = await this.fetchData(authenticationInfo);

    const workspaces = this.getWorkspaces(datasCopy);
    for (const workspace of workspaces)
      workspaceOptions.push({
        value: workspace.id,
        label: workspace.name,
      });

    return { fieldOption: workspaceOptions, newDatas: datasCopy };
  }

  async getSpaceOptions(datas, authenticationInfo, workspace) {
    const spaceOptions = [];
    let datasCopy = { ...datas };

    if (isNil(this.getSpaces(datasCopy, workspace)))
      datasCopy = await this.fetchData(authenticationInfo, workspace);

    const spaces = this.getSpaces(datasCopy, workspace);
    for (const space of spaces)
      spaceOptions.push({
        value: space.id,
        label: space.name,
      });

    return { fieldOption: spaceOptions, newDatas: datasCopy };
  }

  async getFolderOptions(datas, authenticationInfo, space) {
    const folderOptions = [];
    let datasCopy = { ...datas };

    if (isNil(this.getFolders(datas, space)))
      datasCopy = await this.fetchData(authenticationInfo, space);

    const folders = this.getFolders(datasCopy, space);
    for (const folder of folders)
      folderOptions.push({
        value: folder.id,
        label: folder.name,
      });

    return { fieldOption: folderOptions, newDatas: datasCopy };
  }

  async getListOptions(datas, authenticationInfo, folder) {
    const listOptions = [];
    let datasCopy = { ...datas };

    if (isNil(this.getLists(datas, folder)))
      datasCopy = await this.fetchData(authenticationInfo, folder);

    const lists = this.getLists(datasCopy, folder);
    for (const list of lists)
      listOptions.push({
        value: list.id,
        label: list.name,
      });

    return { fieldOption: listOptions, newDatas: datasCopy };
  }

  async getTaskOptions(datas, authenticationInfo, list) {
    const taskOptions = [];
    let datasCopy = { ...datas };

    if (isNil(this.getTasks(datas, list)))
      datasCopy = await this.fetchData(authenticationInfo, list);

    const tasks = this.getTasks(datasCopy, list);
    for (const task of tasks)
      taskOptions.push({
        value: task.id,
        label: task.name,
      });

    return { fieldOption: taskOptions, newDatas: datasCopy };
  }

  getMatchFieldOptions(datas, options) {
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

    const formFieldOptions = Jotform.getFormFieldOptions(datas, options);

    const fieldOptions = this.getFieldOptions(datas, options);

    matchFieldOptions = {
      ...matchFieldOptions,
      destination: [...matchFieldOptions.destination, ...fieldOptions],
      source: formFieldOptions,
    };

    return matchFieldOptions;
  }

  getFieldOptions(datas, options) {
    const fieldOptions = [];
    const fields = this.getAccountFields(datas.destination, options);

    for (const field of fields)
      fieldOptions.push({
        value: field.id,
        label: field.name,
      });

    return fieldOptions;
  }

  getWorkspaces(datas) {
    return datas.workspaces;
  }

  getSpaces(datas, options) {
    const workspaces = this.getWorkspaces(datas);
    const workspace = workspaces.find(
      (workspace) => workspace.id === options.workspace
    );
    return workspace.spaces;
  }

  getFolders(datas, options) {
    const spaces = this.getSpaces(datas, options);
    const space = spaces.find((space) => space.id === options.space);
    return space.folders;
  }

  getLists(datas, options) {
    const folders = this.getFolders(datas, options);
    const folder = folders.find((folder) => folder.id === options.folder);
    return folder.lists;
  }

  getAccountFields(datas, options) {
    const lists = this.getLists(datas, options);
    const list = lists.find((list) => list.id === options.list_id);
    return list.fields;
  }

  getTasks(datas, options) {
    const lists = this.getLists(datas, options);
    const list = lists.find((list) => list.id === options.list_id);
    return list.tasks;
  }

  fetchData(authenticationInfo, requiredSelection) {
    const authId = authenticationInfo.authId;
    const body = {};
    return this.fetchDataFromBackend(body);
  }

  prepareData(data) {
    return data;
  }
}
