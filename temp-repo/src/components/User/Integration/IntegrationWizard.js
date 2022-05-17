import React, { useState, useSyncExternalStore } from "react";

import classes from "./IntegrationWizard.module.css";

import IntegrationAppCard from "./IntegrationAppCard";
import { type } from "@testing-library/user-event/dist/type";

const IntegrationWizard = (props) => {
  const [reversed, setReversed] = useState(false);
  const integrationChoiceHandler = (bool) => {
    props.onClick(bool);
  };

  const switchHandler = (event) => {
    console.log(reversed);
    setReversed((prev) => {
      return !prev;
    });
  };

  return (
    <div className={classes["wizard"]}>
      {reversed ? (
        <IntegrationAppCard onClick={integrationChoiceHandler} type="Source" />
      ) : (
        <IntegrationAppCard onClick={integrationChoiceHandler} type="Source" />
      )}
      <div className={classes["switch-icon"]} onClick={switchHandler}>
        <img src="https://img.icons8.com/ios-glyphs/100/000000/refresh--v2.png" />
      </div>
      {!reversed ? (
        <IntegrationAppCard
          onClick={integrationChoiceHandler}
          type="Destination"
        />
      ) : (
        <IntegrationAppCard
          onClick={integrationChoiceHandler}
          type="Destination"
        />
      )}
    </div>
  );
};

export default IntegrationWizard;
