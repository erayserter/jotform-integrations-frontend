import React, { Fragment, useState } from "react";

import classes from "./IntegrationAppSelector.module.css";
import SelectionCard from "./SelectionCard";

const IntegrationAppSelector = (props) => {
  const [isAppSelectorVisible, setIsAppSelectorVisible] = useState(false);

  const appSelectorHandler = (event) => {
    setIsAppSelectorVisible((prev) => !prev);
  };

  return (
    <Fragment>
      <div className={classes["app-layout-header"]}>
        <h1>Choose {props.type} App</h1>
      </div>
      <div className={classes["app-layout-body"]}>
        <div className={classes["app-selector"]} onClick={appSelectorHandler}>
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 54 54"
            className="jfWizard-list-item-icon-svg"
            width="33"
            height="31"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.25 24.75h22.5V2.25a2.25 2.25 0 014.5 0v22.5h22.5a2.25 2.25 0 010 4.5h-22.5v22.5a2.25 2.25 0 01-4.5 0v-22.5H2.25a2.25 2.25 0 010-4.5z"
              fill="#6F76A7"
            ></path>
          </svg>
        </div>
        <div className={classes["key-action-selector"]}>
          <div className={classes["action-selector"]}>
            <button className={classes["action-button"]}>
              <span>Select An Action.</span>
              <img
                src="https://img.icons8.com/ios-glyphs/90/000000/chevron-down.png"
                alt=""
              />
            </button>
          </div>
          <div className={classes["key-selector"]}>
            <input placeholder="API Key Here." />
          </div>
        </div>
      </div>
      {isAppSelectorVisible && (
        <div className={classes["app-navigation"]}>
          <SelectionCard />
        </div>
      )}
    </Fragment>
  );
};

export default IntegrationAppSelector;
