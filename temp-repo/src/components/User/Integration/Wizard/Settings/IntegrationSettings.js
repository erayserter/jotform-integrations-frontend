import React, { useEffect, useState } from "react";
import Select from "react-select";

import InputContainer from "../../../../UI/InputContainer";
import TagInputContainer from "../../../../UI/TagInputContainer";

import classes from "./IntegrationSettings.module.css";

const appSettings = {
  Jotform: {
    "Get Submission": [
      {
        label: "Choose Form",
        type: "Select",
        selection: "form_id",
        data: [
          { value: "form1", label: "FORM 1" },
          { value: "form2", label: "FORM 2" },
          { value: "form3", label: "FORM 3" },
          { value: "form4", label: "FORM 4" },
          { value: "form5", label: "FORM 5" },
          { value: "form6", label: "FORM 6" },
          { value: "form7", label: "FORM 7" },
        ],
      },
    ],
  },
  Telegram: {
    "Send Message": [
      {
        label: "Chat ID",
        type: "text",
        selection: "chat_id",
      },
      {
        label: "Text",
        selection: "text",
        type: "tagInput",
      },
    ],
  },
};

const tagifySettings = {
  // blacklist: ["xxx", "yyy", "zzz"],
  // maxTags: 6,
  // backspace: "edit",
  addTagOnBlur: false,
  // placeholder: "",
  dropdown: {
    enabled: 0, // a;ways show suggestions dropdown
  },
};

const IntegrationSettings = (props) => {
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    if (
      Object.keys(props.settingsData).length !== 0 ||
      props.settingsData.constructor !== Object
    ) {
      setInputValues(props.settingsData);
    }
  }, []);

  const newValueHandler = (label, type, value) => {
    setInputValues((prev) => {
      return { ...prev, [label]: value };
    });
  };

  const saveHandler = (event) => {
    props.onSave(inputValues);
  };

  // console.log(
  //   inputValues[appSettings[props.appName][props.appAction][0].label] &&
  //     appSettings[props.appName][props.appAction][0].data.filter((element) => {
  //       return (
  //         element.value ===
  //         inputValues[appSettings[props.appName][props.appAction][0].label]
  //       );
  //     })[0]
  // );

  return (
    <div className={classes["settings--container"]}>
      <h3>Settings</h3>
      {appSettings[props.appName][props.appAction].map((e) => {
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
                newValueHandler(e.selection, e.type, event.value);
              }}
              defaultValue={
                inputValues[e.selection] &&
                e.data.filter((element) => {
                  return element.value === inputValues[e.selection];
                })[0]
              }
            />
          );
        else if (e.type == "tagInput")
          return (
            <TagInputContainer
              key={e.selection}
              label={e.label}
              onChange={(value) => {
                newValueHandler(e.selection, e.type, value);
              }}
              defaultValue={inputValues[e.selection]}
            />
          );
        else
          return (
            <InputContainer
              key={e.selection}
              inputLabel={e.label}
              inputType={e.type}
              setter={(value) => newValueHandler(e.selection, e.type, value)}
              default={inputValues[e.selection]}
            />
          );
      })}
      <button onClick={saveHandler}>Save Settings</button>
    </div>
  );
};

export default IntegrationSettings;
