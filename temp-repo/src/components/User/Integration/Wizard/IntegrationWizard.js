import React, { useState, useRef } from "react";

import classes from "./IntegrationWizard.module.css";

import IntegrationAppCard from "./IntegrationAppCard";
import ModalBox from "../../../UI/ModalBox";
import IntegrationAppSelector from "./Selector/IntegrationAppSelector";

const IntegrationWizard = (props) => {
  const [appType, setAppType] = useState("Source");
  const [reversed, setReversed] = useState(false);
  const [isIntegrationChoice, setIsIntegrationChoice] = useState(false);

  const modalClickRef = useRef();

  const integrationChoiceHandler = (bool, type) => {
    setIsIntegrationChoice(bool);
    setAppType(type);
  };

  const switchHandler = (event) => {
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
        <img
          src="https://img.icons8.com/ios-glyphs/100/000000/refresh--v2.png"
          alt=""
        />
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
      {isIntegrationChoice && (
        <ModalBox
          onIntegrationChoice={integrationChoiceHandler}
          ref={modalClickRef}
        >
          <IntegrationAppSelector type={appType} />
        </ModalBox>
      )}
    </div>
  );
};

export default IntegrationWizard;
