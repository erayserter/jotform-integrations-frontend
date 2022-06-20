import React, { useEffect, useState } from "react";
import Select from "react-select";
import cloneDeep from "lodash/cloneDeep";

import InputContainer from "../../../../UI/InputContainer";
import TagInputContainer from "../../../../UI/TagInputContainer";

import classes from "./IntegrationSettings.module.css";
import MatchFieldsContainer from "../../../../UI/MatchFieldsContainer";

const IntegrationSettings = (props) => {
  const [appSettings, setAppSettings] = useState(props.appSettingsInitial);

  const inputValues = props.settingsData;

  const appAction = props.datas[props.type].action;

  const source_app = props.apps.find((e) => {
    return e.id === props.datas.source.id;
  });

  const destination_app = props.apps.find((e) => {
    return e.id === props.datas.destination.id;
  });

  const app = props.apps.find((e) => {
    return e.id === props.datas[props.type].id;
  });

  const appName = app.name;

  useEffect(() => {
    const temp = cloneDeep(appSettings);

    if (
      appName === "Jotform" &&
      temp[appName][appAction][0].data.length === 0
    ) {
      for (const key in props.appDatas[props.type]) {
        temp[appName][appAction][0].data.push({
          value: key,
          label: props.appDatas[props.type][key]["title"],
        });
      }
    }
    if (appName === "Telegram") {
      if (
        appAction === "Send Message" &&
        temp[appName][appAction][1].whitelist.length === 0
      ) {
        const fields =
          props.appDatas["source"][props.settingsData["source"]["form_id"]][
            "fields"
          ];
        for (const field in fields) {
          temp[appName][appAction][1].whitelist.push({
            id: field,
            value: fields[field]["field_name"],
          });
          if (fields[field]["subfields"]) {
            const subfields = fields[field]["subfields"];
            for (const subfield in subfields) {
              temp[appName][appAction][1].whitelist.push({
                id: field + ":" + subfield,
                value: subfields[subfield],
              });
            }
          }
        }
      } else if (
        appAction === "Send Attachments" &&
        temp[appName][appAction][1].data.length === 0
      ) {
        const upload_fields =
          props.appDatas["source"][props.settingsData["source"]["form_id"]][
            "file_upload_fields"
          ];
        for (const field in upload_fields) {
          temp[appName][appAction][1].data.push({
            value: field,
            label: upload_fields[field]["field_name"],
          });
        }
      }
    } else if (appName === "ClickUp") {
      const fields = temp[appName][appAction];
      const user = props.appDatas.destination;
      const workspaces = user.workspaces;
      if (fields[0].data.length === 0) {
        for (const workspace of workspaces)
          fields[0].data.push({ value: workspace.id, label: workspace.name });
      }
      if (
        fields[1].data.length === 0 &&
        fields[0].selection in inputValues[props.type]
      ) {
        const workspace = workspaces.filter((workspace) => {
          return inputValues[props.type][fields[0].selection] === workspace.id;
        })[0];
        const spaces = workspace.spaces;
        for (const space of spaces)
          fields[1].data.push({ value: space.id, label: space.name });
      }
      if (
        fields[2].data.length === 0 &&
        fields[1].selection in inputValues[props.type]
      ) {
        const workspace = workspaces.find(
          (workspace) =>
            workspace.id === inputValues[props.type][fields[0].selection]
        );
        const space = workspace.spaces.find(
          (space) => space.id === inputValues[props.type][fields[1].selection]
        );
        const folders = space.folders;
        for (const folder of folders)
          fields[2].data.push({ value: folder.id, label: folder.name });
      }
      if (
        fields[3].data.length === 0 &&
        fields[2].selection in inputValues[props.type]
      ) {
        const workspace = workspaces.find(
          (workspace) =>
            workspace.id === inputValues[props.type][fields[0].selection]
        );
        const space = workspace.spaces.find(
          (space) => space.id === inputValues[props.type][fields[1].selection]
        );
        const folder = space.folders.find(
          (folder) => folder.id === inputValues[props.type][fields[2].selection]
        );
        const lists = folder.lists;
        for (const list of lists)
          fields[3].data.push({ value: list.id, label: list.name });
      }
      if (
        (appAction === "Create Subtask" || appAction === "Create Comment") &&
        fields[4].data.length === 0 &&
        fields[3].selection in inputValues[props.type]
      ) {
        const workspace = workspaces.find(
          (workspace) =>
            workspace.id === inputValues[props.type][fields[0].selection]
        );
        const space = workspace.spaces.find(
          (space) => space.id === inputValues[props.type][fields[1].selection]
        );
        const folder = space.folders.find(
          (folder) => folder.id === inputValues[props.type][fields[2].selection]
        );
        const list = folder.lists.find((list2) => {
          return list2.id === inputValues[props.type][fields[3].selection];
        });
        const tasks = list.tasks;
        for (const task of tasks)
          fields[4].data.push({ value: task.id, label: task.name });
      }
      if (
        appAction === "Create Comment" &&
        fields[5].whitelist.length === 0 &&
        fields[4].selection in inputValues[props.type]
      ) {
        const form_fields =
          props.appDatas["source"][props.settingsData["source"]["form_id"]][
            "fields"
          ];
        for (const field in form_fields) {
          fields[5].whitelist.push({
            id: field,
            value: form_fields[field]["field_name"],
          });
          if (form_fields[field]["subfields"]) {
            const subfields = form_fields[field]["subfields"];
            for (const subfield in subfields) {
              fields[5].whitelist.push({
                id: field + ":" + subfield,
                value: subfields[subfield],
              });
            }
          }
        }
      }
    }
    setAppSettings(temp);
  }, [props.datas, props.apps, props.appDatas, props.type, props.settingsData]);

  const newValueHandler = (label, value) => {
    inputValues[props.type][label] = value;
    props.onSettingsChange(inputValues[props.type], props.type);
  };

  const saveHandler = (event) => {
    props.onSave(inputValues[props.type], props.type);
  };

  return (
    <div className={classes["settings--container"]}>
      <h1>{appName} Settings</h1>
      {appSettings[appName][appAction].map((e) => {
        if (e.type === "Select") {
          if (e.data.length <= 0 && !(e.selection in inputValues[props.type]))
            return;
          return (
            <div className={classes["select--container"]}>
              <label>{e.label}</label>
              <Select
                key={e.selection}
                isMulti={e.isMulti}
                className="basic-multi-select"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="actions"
                options={e.data}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                menuPlacement="bottom"
                onChange={(event) => {
                  if (e.isMulti) {
                    newValueHandler(
                      e.selection,
                      event.map((element) => {
                        return parseInt(element.value, 10);
                      })
                    );
                  } else newValueHandler(e.selection, event.value);
                }}
                value={
                  e.data.filter((element) => {
                    return (
                      element.value === inputValues[props.type][e.selection]
                    );
                  })[0]
                }
              />
            </div>
          );
        } else if (e.type === "tagInput") {
          if (e.whitelist.length <= 0) return;
          return (
            <TagInputContainer
              key={e.selection}
              label={e.label}
              onChange={(value) => {
                newValueHandler(e.selection, value);
              }}
              defaultValue={inputValues[props.type][e.selection]}
              whitelist={e.whitelist}
            />
          );
        } else if (e.type === "matchFields") {
          return (
            <MatchFieldsContainer
              label={e.label}
              apps={{ source: source_app, destination: destination_app }}
              maxLength={4}
            />
          );
        } else
          return (
            <InputContainer
              key={e.selection}
              inputLabel={e.label}
              inputType={e.type}
              setter={(value) => newValueHandler(e.selection, value)}
              default={inputValues[props.type][e.selection]}
            />
          );
      })}
      <button className={classes["settings--sendButton"]} onClick={saveHandler}>
        {props.type === "source" ? "Next" : "Save Settings"}
      </button>
      {props.type !== "source" && (
        <button
          className={classes["prevButton"]}
          onClick={() => props.onPreviousModal("source")}
        >
          <img
            width="16"
            height="16"
            src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/undefined/external-left-arrow-arrows-dreamstale-lineal-dreamstale.png"
          />
        </button>
      )}
    </div>
  );
};

export default IntegrationSettings;
