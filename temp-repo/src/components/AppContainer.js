import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import classes from "./AppContainer.module.css";

import Navbar from "./Navbar/Navbar";
import UserContent from "./User/Content/UserContent";
import IntegrationContent from "./User/Integration/IntegrationContent";

const AppContainer = (props) => {
  const [isIntegrationContent, setIsIntegrationContent] = useState(false);

  const logedinContent = isIntegrationContent ? (
    <IntegrationContent onNewIntegration={setIsIntegrationContent} />
  ) : (
    <UserContent onNewIntegration={setIsIntegrationContent} />
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
