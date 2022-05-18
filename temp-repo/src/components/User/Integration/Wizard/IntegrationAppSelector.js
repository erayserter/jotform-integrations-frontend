import React, { Fragment } from "react";

import classes from "./IntegrationAppSelector.module.css";

const IntegrationAppSelector = (props) => {
  return (
    <Fragment>
      <div className={classes["app-layout"]}>
        <div className={classes["app-selector"]}>
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 54 54"
            className="jfWizard-list-item-icon-svg"
            width="23"
            height="21"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.25 24.75h22.5V2.25a2.25 2.25 0 014.5 0v22.5h22.5a2.25 2.25 0 010 4.5h-22.5v22.5a2.25 2.25 0 01-4.5 0v-22.5H2.25a2.25 2.25 0 010-4.5z"
              fill="#6F76A7"
            ></path>
          </svg>
        </div>
        <div className={classes["key-action-selector"]}></div>
      </div>
    </Fragment>
  );
};

export default IntegrationAppSelector;
