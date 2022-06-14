import React from "react";

import classes from "./IntegrationTitle.module.css";

const IntegrationTitle = (props) => {
  return (
    <div className={classes["integration-title"]}>
      <h1>Create An Integration</h1>
      <h2>Select applications to easly create an integration between them.</h2>
    </div>
  );
};

export default IntegrationTitle;
