import React from "react";
// import { usePopper } from "react-popper";

import classes from "./IntegrationApp.module.css";

const IntegrationApp = (props) => {
  const clickHandler = (event) => {
    props.onAppSelect(props.id);
  };

  return (
    <div className={classes["app-container"]}>
      <img
        className={classes["app-image"]}
        onClick={clickHandler}
        alt=""
        src={props.img}
      />
      <span>{props.name}</span>
    </div>
  );
};

export default IntegrationApp;
