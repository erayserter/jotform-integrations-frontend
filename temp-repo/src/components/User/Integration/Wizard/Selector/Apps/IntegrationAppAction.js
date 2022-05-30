import React from "react";

import classes from "./IntegrationAppAction.module.css";

const IntegrationAppAction = (props) => {
  return (
    <li
      className={classes["dropdown-item"]}
      onClick={(e) => {
        props.onActionSelect(props.id);
      }}
    >
      <img src={props.img} alt="selected-app-icon" />
      <span>{props.actionName}</span>
    </li>
  );
};

export default IntegrationAppAction;
