import App from "../App";
import Action from "./Action";
import Jotform from "./Jotform";
import Select from "./fields/Select";
import MatchFields from "./fields/MatchFields";
import TagInput from "./fields/TagInput";

const ID = 3;
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

  getOptionFromSelection(datas, selection, type, requiredInfo = {}) {
    const selectedTypeData = datas[type];
    const allTypeData = datas;
    switch (selection) {
      case "workspace":
        return this.getWorkspaceOptions(selectedTypeData);
      case "space":
        if (requiredInfo.workspace != null)
          return this.getSpaceOptions(selectedTypeData, requiredInfo);
        return [];
      case "folder":
        if (requiredInfo.space != null)
          return this.getFolderOptions(selectedTypeData, requiredInfo);
        return [];
      case "list_id":
        if (requiredInfo.folder != null)
          return this.getListOptions(selectedTypeData, requiredInfo);
        return [];
      case "task":
        if (requiredInfo.list != null)
          return this.getTaskOptions(selectedTypeData, requiredInfo);
        return [];
      case "match_fields":
        if (
          requiredInfo.list != null &&
          (!requiredInfo.subtask || requiredInfo.task != null)
        )
          return this.getMatchFieldOptions(allTypeData, requiredInfo);
        return { source: [], destination: [] };
      case "comment":
        if (requiredInfo.task != null)
          return Jotform.getFormTagInputOptions(allTypeData, requiredInfo);
        return [];
    }
  }

  getWorkspaceOptions(datas) {
    const workspaceOptions = [];
    const workspaces = this.getWorkspaces(datas);
    for (const workspace of workspaces)
      workspaceOptions.push({
        value: workspace.id,
        label: workspace.name,
      });
    return workspaceOptions;
  }

  getSpaceOptions(datas, workspace) {
    const spaceOptions = [];
    const spaces = this.getSpaces(datas, workspace);
    for (const space of spaces)
      spaceOptions.push({
        value: space.id,
        label: space.name,
      });
    return spaceOptions;
  }

  getFolderOptions(datas, space) {
    const folderOptions = [];
    const folders = this.getFolders(datas, space);
    for (const folder of folders)
      folderOptions.push({
        value: folder.id,
        label: folder.name,
      });
    return folderOptions;
  }

  getListOptions(datas, folder) {
    const listOptions = [];
    const lists = this.getLists(datas, folder);
    for (const list of lists)
      listOptions.push({
        value: list.id,
        label: list.name,
      });
    return listOptions;
  }

  getTaskOptions(datas, list) {
    const taskOptions = [];
    const tasks = this.getTasks(datas, list);
    for (const task of tasks)
      taskOptions.push({
        value: task.id,
        label: task.name,
      });
    return taskOptions;
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
    const fields = this.getFields(datas.destination, options);

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

  getFields(datas, options) {
    const lists = this.getLists(datas, options);
    const list = lists.find((list) => list.id === options.list);
    return list.fields;
  }

  getTasks(datas, options) {
    const lists = this.getLists(datas, options);
    const list = lists.find((list) => list.id === options.list);
    return list.tasks;
  }
}
