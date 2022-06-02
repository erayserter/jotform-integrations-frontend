import React, { useEffect, useState } from "react";
import Select from "react-select";
import cloneDeep from "lodash/cloneDeep";

import InputContainer from "../../../../UI/InputContainer";
import TagInputContainer from "../../../../UI/TagInputContainer";

import classes from "./IntegrationSettings.module.css";

const IntegrationSettings = (props) => {
  const [inputValues, setInputValues] = useState({
    source: {},
    destination: {},
  });
  const [appSettings, setAppSettings] = useState(props.appSettingsInitial);

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
    if (
      props.app.name === "Telegram" &&
      temp[props.app.name][props.appAction][1].whitelist.length === 0
    ) {
      const fields =
        props.appDatas["source"][props.settingsData["source"]["form_id"]][
          "fields"
        ];
      let count = 0;
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
    }
    setAppSettings(temp);
    if (
      Object.keys(props.settingsData[props.type]).length !== 0 ||
      props.settingsData[props.type].constructor !== Object
    ) {
      // setInputValues(props.settingsData[props.type]);
      setInputValues((prev) => {
        return { ...prev, [props.type]: props.settingsData[props.type] };
      });
    }
  }, [
    props.app.name,
    props.appAction,
    props.appDatas,
    props.settingsData,
    props.type,
  ]);

  const newValueHandler = (label, value) => {
    // setInputValues((prev) => {
    //   return { ...prev, [label]: value };
    // });
    setInputValues((prev) => {
      return { ...prev, [props.type]: { ...prev[props.type], [label]: value } };
    });
  };

  const saveHandler = (event) => {
    props.onSave(inputValues[props.type], props.type);
  };

  return (
    <div className={classes["settings--container"]}>
      <h1>{props.app.name} Settings</h1>
      {appSettings[props.app.name][props.appAction].map((e) => {
        if (e.type === "Select")
          return (
            <Select
              key={e.selection}
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              name="actions"
              options={e.data}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
              menuPlacement="bottom"
              onChange={(event) => {
                newValueHandler(e.selection, event.value);
              }}
              defaultValue={
                inputValues[props.type][e.selection] &&
                e.data.filter((element) => {
                  return element.value === inputValues[props.type][e.selection];
                })[0]
              }
            />
          );
        else if (e.type === "tagInput") {
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
      <button onClick={saveHandler}>
        {props.type === "source" ? "Next" : "Save Settings"}
      </button>
    </div>
  );
};

export default IntegrationSettings;
