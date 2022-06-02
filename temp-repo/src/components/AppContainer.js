import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import classes from "./AppContainer.module.css";

import Navbar from "./Navbar/Navbar";
import UserContent from "./User/Content/UserContent";
import IntegrationContent from "./User/Integration/IntegrationContent";

const AppContainer = (props) => {
  const [isIntegrationContent, setIsIntegrationContent] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [oldContent, setOldContent] = useState({});

  const integrationUpdateHandler = (webhook, bool) => {
    setIsUpdate(true);
    setIsIntegrationContent(true);
    setOldContent(webhook);
  };

  const closeHandler = () => {
    setIsIntegrationContent(false);
    setIsUpdate(false);
    setOldContent({});
  };

  const logedinContent = isIntegrationContent ? (
    <IntegrationContent
      onNewIntegration={setIsIntegrationContent}
      onClose={closeHandler}
      update={isUpdate}
      oldContent={oldContent}
    />
  ) : (
    <UserContent
      onNewIntegration={setIsIntegrationContent}
      onIntegrationUpdate={integrationUpdateHandler}
    />
  );

  if (!props.isLoggedIn)
    return (
      <Navigate
        to={{
          pathname: "/login",
        }}
      />
    );

  return (
    <div className={classes["container"]}>
      <Navbar />
      {logedinContent}
    </div>
  );
};

export default AppContainer;
