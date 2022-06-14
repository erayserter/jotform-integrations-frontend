import React from "react";

import classes from "./IntegrationHeader.module.css";

import IntegrationTitle from "./IntegrationTitle";
import IntegrationAppCard from "../Wizard/IntegrationAppCard";

const IntegrationHeader = (props) => {
  return (
    <div className={classes["integration-header"]}>
      <IntegrationTitle />
      <div className={classes["integration-header__cards"]}>
        <IntegrationAppCard
          text="Create with Wizard"
          onClick={() => {
            props.onSelect("wizard");
          }}
        />
        <IntegrationAppCard
          text="Use Template"
          onClick={() => {
            props.onSelect("template");
          }}
        />
      </div>
    </div>
  );
};

export default IntegrationHeader;
