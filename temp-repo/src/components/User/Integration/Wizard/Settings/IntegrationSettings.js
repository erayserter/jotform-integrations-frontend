import React, { useEffect } from "react";
import Select from "react-select";

import InputContainer from "../../../../UI/InputContainer";
import TagInputContainer from "../../../../UI/TagInputContainer";
import MatchFieldsContainer from "../../../../UI/MatchFieldsContainer";

import classes from "./IntegrationSettings.module.css";

import Jotform from "../../../../../data/apps/Jotform";
import ClickUp from "../../../../../data/apps/ClickUp";
import Telegram from "../../../../../data/apps/Telegram";

const IntegrationSettings = (props) => {
  const inputValues = props.settingsData;

  const source_app = props.apps.find((e) => {
    return e.id === props.datas.source.id;
  });

  const destination_app = props.apps.find((e) => {
    return e.id === props.datas.destination.id;
  });

  const app = props.apps.find((e) => {
    return e.id === props.datas[props.type].id;
  });

  const appAction = props.datas[props.type].action;
  const appOptions = props.appOptions;
  const appName = app.name;

  useEffect(() => {
    let data = {};

    if (appName === "Jotform") {
      data = new Jotform().init(props.appDatas, appAction, props.type);
    }
    if (appName === "Telegram") {
      data = new Telegram().init(props.appDatas, appAction, props.type, {
        formId: inputValues.source.form_id,
      });
    }
    if (appName === "ClickUp") {
      data = new ClickUp().init(props.appDatas, appAction, props.type, {
        workspace: inputValues[props.type].workspace,
        space: inputValues[props.type].space,
        folder: inputValues[props.type].folder,
        list: inputValues[props.type].list_id,
        task: inputValues[props.type].task,
        formId: inputValues.source.form_id,
        subtask: appAction === "Create Subtask",
      });
    }

    props.onOptionChange(appName, data);
  }, [props.datas, props.apps, props.appDatas, props.type, props.settingsData]);

  const newValueHandler = (value, labelData, isExternal) => {
    if (isExternal == null || isExternal === false) {
      inputValues[props.type][labelData] = value;
      props.onSettingsChange(inputValues[props.type], props.type);
    } else {
      inputValues[props.type] = { ...inputValues[props.type], ...labelData };
    }
  };

  const saveHandler = (event) => {
    props.onSave(inputValues[props.type], props.type);
  };

  return (
    <div className={classes["settings--container"]}>
      <h1>{appName} Settings</h1>
      {props.appSettingsInitial[appName][appAction].map((e) => {
        if (e.type === "Select") {
          if (
            props.appOptions[appName][e.selection] == null ||
            props.appOptions[appName][e.selection].length <= 0
          )
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
                options={props.appOptions[appName][e.selection]}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                menuPlacement="bottom"
                onChange={(event) => {
                  if (e.isMulti) {
                    newValueHandler(
                      event.map((element) => {
                        return parseInt(element.value, 10);
                      }),
                      e.selection
                    );
                  } else newValueHandler(event.value, e.selection);
                }}
                value={
                  inputValues[props.type][e.selection] != null &&
                  props.appOptions[appName][e.selection].find((element) => {
                    if (e.isMulti)
                      return (
                        inputValues[props.type][e.selection].find(
                          (dataId) => element.value == dataId
                        ) != null
                      );
                    return (
                      element.value === inputValues[props.type][e.selection]
                    );
                  })
                }
              />
            </div>
          );
        } else if (e.type === "tagInput") {
          if (
            props.appOptions[appName][e.selection] == null ||
            props.appOptions[appName][e.selection].length <= 0
          )
            return;
          return (
            <TagInputContainer
              key={e.selection}
              label={e.label}
              onChange={(value) => {
                newValueHandler(value, e.selection);
              }}
              defaultValue={inputValues[props.type][e.selection]}
              whitelist={props.appOptions[appName][e.selection]}
            />
          );
        } else if (e.type === "matchFields") {
          if (
            props.appOptions[appName][e.selection] == null ||
            props.appOptions[appName][e.selection].source.length <= 0 ||
            props.appOptions[appName][e.selection].destination.length <= 0
          )
            return;
          return (
            <MatchFieldsContainer
              label={e.label}
              apps={{ source: source_app, destination: destination_app }}
              maxLength={4}
              datas={props.appOptions[appName][e.selection]}
              default={inputValues[props.type][e.selection]}
              onChange={(value) => {
                newValueHandler(value, e.selection);
              }}
            />
          );
        } else
          return (
            <InputContainer
              key={e.selection}
              inputLabel={e.label}
              inputType={e.type}
              setter={(value) => newValueHandler(value, e.selection)}
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
