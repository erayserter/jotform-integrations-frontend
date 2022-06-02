import React from "react";

import classes from "./IntegrationHeader.module.css";

const IntegrationHeader = (props) => {
  return (
    <div className={classes["integration--header"]}>
      <h1>{props.update ? "Update" : "Create"} An Integration</h1>
      <h2>
        Select applications to{" "}
        {props.update ? "configure" : "easly create an integration between"}{" "}
        them.
      </h2>
    </div>
  );
};

export default IntegrationHeader;
