import React from "react";

import classes from "./IntegrationWizard.module.css";

import IntegrationAppCard from "./IntegrationAppCard";

const IntegrationWizard = (props) => {
  return (
    <div className={classes["integration--wizard"]}>
      <IntegrationAppCard />
      <IntegrationAppCard />
    </div>
  );
};

export default IntegrationWizard;
