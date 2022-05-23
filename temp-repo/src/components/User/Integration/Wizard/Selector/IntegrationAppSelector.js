import React, { Fragment, useState } from "react";

import classes from "./IntegrationAppSelector.module.css";
import IntegrationAppSelectorDropdown from "./IntegrationAppSelectorDropdown";
import SelectionCard from "./SelectionCard";

const IntegrationAppSelector = (props) => {
  const [isAppSelectorVisible, setIsAppSelectorVisible] = useState(true);
  const [isKeySelectorVisible, setIsKeySelectorVisible] = useState(false);

  const [selectedAppID, setSelectedAppID] = useState(null);
  const [selectedActionID, setSelectedActionID] = useState(null);

  const [selectorStyle, setSelectorStyle] = useState({});
  const [actionSelectorStyle, setActionSelectorStyle] = useState({});
  const [apiKey, setApiKey] = useState("");

  const appSelectorSectionHandler = (event) => {
    setIsAppSelectorVisible((prev) => !prev);
  };

  const appSelectHandler = (id) => {
    setSelectorStyle({ flexBasis: "85%" });
    setActionSelectorStyle({ display: "block" });
    setIsAppSelectorVisible(false);
    setSelectedAppID(id);
  };

  const actionSelectHandler = (id) => {
    setSelectedActionID(id);
    setIsKeySelectorVisible(true);
  };

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
              src="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
              width="60"
              height="60"
            />
          )}
        </div>
        <div className={classes["key-action-selector"]} style={selectorStyle}>
          <div
            className={classes["action-selector"]}
            style={actionSelectorStyle}
          >
            <span>Action</span>
            <IntegrationAppSelectorDropdown
              onActionSelect={actionSelectHandler}
            />
          </div>
          {isKeySelectorVisible && (
            <div className={classes["key-selector"]}>
              <span>API Key</span>
              <input
                placeholder="API Key Here."
                onChange={(e) => {
                  setApiKey(e.target.value);
                }}
              />
            </div>
          )}
        </div>
      </div>
      {isAppSelectorVisible && (
        <div className={classes["app-navigation"]}>
          <SelectionCard onAppSelect={appSelectHandler} />
        </div>
      )}
    </Fragment>
  );
};

export default IntegrationAppSelector;
