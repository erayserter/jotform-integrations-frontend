import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";

import classes from "./IntegrationAppSelector.module.css";
import SelectionCard from "./SelectionCard";

async function validateApiKey(credentials) {
  return fetch("https://b-ersoz.jotform.dev/intern-api/validateApiKey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

const IntegrationAppSelector = (props) => {
  const [isAppSelectorVisible, setIsAppSelectorVisible] = useState(true);
  const [isKeySelectorVisible, setIsKeySelectorVisible] = useState(false);

  const [selectedAppID, setSelectedAppID] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [apiKey, setApiKey] = useState("");

  const appSelectorSectionHandler = (event) => {
    setIsAppSelectorVisible((prev) => !prev);
  };

  const appSelectHandler = (id) => {
    setIsAppSelectorVisible(false);
    setSelectedAppID(id);
  };

  const actionSelectHandler = (value) => {
    setSelectedAction(value);
    setIsKeySelectorVisible(true);
  };

  const authHandler = async (event) => {
    const app = props.apps.filter((e) => e.id === selectedAppID)[0];
    const res = await validateApiKey({
      app_name: app.name,
      action: selectedAction,
      api_key: apiKey,
    });
    if (res.content.status == 200)
      props.onAuthenticate([selectedAppID, selectedAction, apiKey], props.type);
  };

  useEffect(() => {
    if (props.type === "Source" && props.datas.source[0] != null) {
      setSelectedAppID(props.datas.source[0]);
      setSelectedAction(props.datas.source[1]);
      setApiKey(props.datas.source[2]);
      setIsAppSelectorVisible(false);
      setIsKeySelectorVisible(true);
    } else if (props.datas.destination[0] != null) {
      setSelectedAppID(props.datas.destination[0]);
      setSelectedAction(props.datas.destination[1]);
      setApiKey(props.datas.destination[2]);
      setIsAppSelectorVisible(false);
      setIsKeySelectorVisible(true);
    }
  }, [props.datas, props.type]);

  return (
    <Fragment>
      <div className={classes["app-layout-header"]}>
        <h1>Choose {props.type} App</h1>
      </div>
      <div className={classes["app-layout-body"]}>
        <div
          className={classes["app-selector"]}
          onClick={appSelectorSectionHandler}
        >
          {selectedAppID && (
            <img
              src={props.apps.filter((e) => e.id === selectedAppID)[0].img}
              width="60"
              height="60"
            />
          )}
        </div>
        <div className={classes["key-action-selector"]}>
          {selectedAppID && (
            <div className={classes["action-selector"]}>
              <span>Action</span>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="actions"
                options={
                  props.type === "Source"
                    ? props.apps
                        .filter((e) => e.id === selectedAppID)[0]
                        .triggers.map((e) => {
                          return { value: e, label: e };
                        })
                    : props.apps
                        .filter((e) => e.id === selectedAppID)[0]
                        .actions.map((e) => {
                          return { value: e, label: e };
                        })
                }
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                menuPlacement="bottom"
                onChange={(e) => {
                  actionSelectHandler(e.value);
                }}
                defaultValue={
                  selectedAction != "" && {
                    value: selectedAction,
                    label: selectedAction,
                  }
                }
              />
            </div>
          )}

          {isKeySelectorVisible && (
            <div className={classes["key-selector"]}>
              <span>API Key</span>
              <div className={classes["key-input"]}>
                <input
                  placeholder="API Key Here."
                  onChange={(e) => {
                    setApiKey(e.target.value);
                  }}
                  value={apiKey}
                />
                <button onClick={authHandler}>Authenticate</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isAppSelectorVisible && (
        <div className={classes["app-navigation"]}>
          <SelectionCard apps={props.apps} onAppSelect={appSelectHandler} />
        </div>
      )}
    </Fragment>
  );
};

export default IntegrationAppSelector;
