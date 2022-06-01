import React, { useEffect, useState } from "react";
import Select from "react-select";

import InputContainer from "../../../../UI/InputContainer";
import TagInputContainer from "../../../../UI/TagInputContainer";

import classes from "./IntegrationSettings.module.css";

// {
//   "responseCode": 200,
//   "message": "success",
//   "content": {
//       "responseCode": 200,
//       "content": {
//           "221363901691050": {
//               "title": "Form1",
//               "created_at": "2022-05-17 08:27:49",
//               "updated_at": "2022-05-17 09:13:46",
//               "status": "ENABLED",
//               "fields": {
//                   "3": {
//                       "field_name": "Name",
//                       "subfields": {
//                           "first": "First Name",
//                           "last": "Last Name"
//                       }
//                   }
//               }
//           },
//           "221363053821043": {
//               "title": "Form2",
//               "created_at": "2022-05-17 07:47:14",
//               "updated_at": "2022-05-17 08:28:08",
//               "status": "ENABLED",
//               "fields": {
//                   "3": {
//                       "field_name": "Name",
//                       "subfields": {
//                           "first": "First Name",
//                           "last": "Last Name"
//                       }
//                   },
//                   "4": {
//                       "field_name": "Email"
//                   },
//                   "5": {
//                       "field_name": "Address",
//                       "subfields": {
//                           "cc_firstName": "First Name",
//                           "cc_lastName": "Last Name",
//                           "cc_number": "Credit Card Number",
//                           "cc_ccv": "Security Code",
//                           "cc_exp_month": "Expiration Month",
//                           "cc_exp_year": "Expiration Year",
//                           "addr_line1": "Street Address",
//                           "addr_line2": "Street Address Line 2",
//                           "city": "City",
//                           "state": "State \/ Province",
//                           "postal": "Postal \/ Zip Code",
//                           "country": "Country"
//                       }
//                   }
//               }
//           }
//       }
//   },
//   "duration": "511.42ms"
// }

const appSettings = {
  Jotform: {
    "Get Submission": [
      {
        label: "Choose Form",
        type: "Select",
        selection: "form_id",
        data: [],
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
        whitelist: [],
      },
    ],
  },
};

const tagifySettings = {
  addTagOnBlur: false,
  dropdown: {
    enabled: 0,
  },
};

const IntegrationSettings = (props) => {
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    if (
      props.appName === "Jotform" &&
      appSettings[props.appName][props.appAction][0].data.length === 0
    ) {
      for (const key in props.appDatas[props.type]) {
        appSettings[props.appName][props.appAction][0].data.push({
          value: key,
          label: props.appDatas[props.type][key]["title"],
        });
      }
    }
    if (
      props.appName === "Telegram" &&
      appSettings[props.appName][props.appAction][1].whitelist.length === 0
    ) {
      let count = 0;
      for (const field in props.appDatas["source"][
        props.settingsData["source"]["form_id"]
      ]["fields"]) {
        appSettings[props.appName][props.appAction][1].whitelist.push({
          id: count++,
          value:
            props.appDatas["source"][props.settingsData["source"]["form_id"]][
              "fields"
            ][field]["field_name"],
        });
      }
      // console.log(appSettings[props.appName][props.appAction][1].whitelist);
      console.log(props.appDatas);
    }
    if (
      Object.keys(props.settingsData[props.type]).length !== 0 ||
      props.settingsData[props.type].constructor !== Object
    ) {
      setInputValues(props.settingsData[props.type]);
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
              whitelist={
                appSettings[props.appName][props.appAction][1].whitelist
              }
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
