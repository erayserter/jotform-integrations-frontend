import React from "react";

import classes from "./IntegrationApp.module.css";

const IntegrationApp = (props) => {
  const clickHandler = (event) => {
    props.onAppSelect(props.app);
  };

  return (
    <div
      className={`${classes["app-container"]} flex flex-col items-center overflow-hidden`}
    >
      <img
        className={`${classes["app-image"]} block cursor-pointer`}
        onClick={clickHandler}
        alt=""
        src={props.app.url}
        width="50px"
      />
      <span>{props.app.name}</span>
    </div>
  );
};

export default IntegrationApp;
