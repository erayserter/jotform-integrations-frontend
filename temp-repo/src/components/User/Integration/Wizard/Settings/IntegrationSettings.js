import React, { useEffect, useState } from "react";
import Select from "react-select";
import cloneDeep from "lodash/cloneDeep";

import InputContainer from "../../../../UI/InputContainer";
import TagInputContainer from "../../../../UI/TagInputContainer";

import classes from "./IntegrationSettings.module.css";

const IntegrationSettings = (props) => {
  const [appSettings, setAppSettings] = useState(props.appSettingsInitial);

  const inputValues = props.settingsData;

  useEffect(() => {
    const temp = cloneDeep(appSettings);

    if (
      props.app.name === "Jotform" &&
      temp[props.app.name][props.appAction][0].data.length === 0
    ) {
      for (const key in props.appDatas[props.type]) {
        temp[props.app.name][props.appAction][0].data.push({
          value: key,
          label: props.appDatas[props.type][key]["title"],
        });
      }
    }
    if (props.app.name === "Telegram") {
      if (
        props.appAction === "Send Message" &&
        temp[props.app.name][props.appAction][1].whitelist.length === 0
      ) {
        const fields =
          props.appDatas["source"][props.settingsData["source"]["form_id"]][
            "fields"
          ];
        for (const field in fields) {
          temp[props.app.name][props.appAction][1].whitelist.push({
            id: field,
            value: fields[field]["field_name"],
          });
          if (fields[field]["subfields"]) {
            const subfields = fields[field]["subfields"];
            for (const subfield in subfields) {
              temp[props.app.name][props.appAction][1].whitelist.push({
                id: field + ":" + subfield,
                value: subfields[subfield],
              });
            }
          }
        }
      } else if (
        props.appAction === "Send Attachments" &&
        temp[props.app.name][props.appAction][1].data.length === 0
      ) {
        const upload_fields =
          props.appDatas["source"][props.settingsData["source"]["form_id"]][
            "file_upload_fields"
          ];
        for (const field in upload_fields) {
          temp[props.app.name][props.appAction][1].data.push({
            value: field,
            label: upload_fields[field]["field_name"],
          });
        }
      }
    }
    setAppSettings(temp);
  }, [props.app.name, props.appAction, props.appDatas, props.type]);

  const newValueHandler = (label, value) => {
    inputValues[props.type][label] = value;
    props.onSettingsChange(inputValues[props.type], props.type);
  };

  const saveHandler = (event) => {
    props.onSave(inputValues[props.type], props.type);
  };

  return (
    <div className={classes["settings--container"]}>
      <h1>{props.app.name} Settings</h1>
      {appSettings[props.app.name][props.appAction].map((e) => {
        if (e.type === "Select") {
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
          if (
            appSettings[props.app.name][props.appAction][1].whitelist.length <=
            0
          )
            return;
          return (
            <TagInputContainer
              key={e.selection}
              label={e.label}
              onChange={(value) => {
                newValueHandler(e.selection, value);
              }}
              defaultValue={inputValues[props.type][e.selection]}
              whitelist={
                appSettings[props.app.name][props.appAction][1].whitelist
              }
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
