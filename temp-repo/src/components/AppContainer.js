import React, { useState } from "react";

import classes from "./AppContainer.module.css";

import Navbar from "./Navbar/Navbar";
import ModalBox from "./UI/ModalBox";
import UserContent from "./User/Content/UserContent";
import IntegrationContent from "./User/Integration/IntegrationContent";

const AppContainer = (props) => {
  const [isIntegrationContent, setIsIntegrationContent] = useState(false);

  const newIntegrationHandler = (bool) => {
    setIsIntegrationContent(bool);
  };

  return (
    <div className={classes["container"]}>
      <Navbar />
      {isIntegrationContent ? (
        <IntegrationContent onNewIntegration={newIntegrationHandler} />
      ) : (
        <UserContent onNewIntegration={newIntegrationHandler} />
      )}
    </div>
  );
};

export default AppContainer;
