import React, { useState } from "react";

import classes from "./AppContainer.module.css";

import Navbar from "./Navbar/Navbar";
import ModalBox from "./UI/ModalBox";
import UserContent from "./User/Content/UserContent";
import IntegrationContent from "./User/Integration/IntegrationContent";

const AppContainer = (props) => {
  const [isIntegrationContent, setIsIntegrationContent] = useState(false);
  const [isIntegrationChoice, setIsIntegrationChoice] = useState(false);

  const newIntegrationHandler = (bool) => {
    setIsIntegrationContent(bool);
  };

  const integrationChoiceHandler = (bool) => {
    setIsIntegrationChoice(bool);
  };

  return (
    <div className={classes["container"]}>
      <Navbar />
      {isIntegrationContent ? (
        <IntegrationContent
          onNewIntegration={newIntegrationHandler}
          onIntegrationChoice={integrationChoiceHandler}
        />
      ) : (
        <UserContent onNewIntegration={newIntegrationHandler} />
      )}
      {isIntegrationChoice && (
        <ModalBox onIntegrationChoice={integrationChoiceHandler} />
      )}
    </div>
  );
};

export default AppContainer;
