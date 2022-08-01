import React from "react";

import classes from "./IntegrationAppAction.module.css";

const IntegrationAppAction = (props) => {
  return (
    <li
      className={`flex items-center justify-start h-10 px-4 border-b border-solid border-navy-100 cursor-pointer`}
      onClick={(e) => {
        props.onActionSelect(props.id);
      }}
    >
      <img src={props.img} alt="selected-app-icon" width="30px" />
      <span className="ml-2">{props.actionName}</span>
    </li>
  );
};

export default IntegrationAppAction;
