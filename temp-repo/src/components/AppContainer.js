import React from "react";

import classes from "./AppContainer.module.css";

import Navbar from "./Navbar/Navbar";
import UserContent from "./User/Content/UserContent";

const AppContainer = (props) => {
  return (
    <div className={classes["container"]}>
      <Navbar />
      <UserContent />
    </div>
  );
};

export default AppContainer;
