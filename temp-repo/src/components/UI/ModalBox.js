import React from "react";

import classes from "./ModalBox.module.css";

const ModalBox = (props) => {
  const clickHandler = (event) => {
    props.onIntegrationChoice(false);
  };

  return (
    <div className={classes["modalbox"]} onClick={clickHandler}>
      <div className={classes["modal-content"]}>{props.children}</div>
    </div>
  );
};

export default ModalBox;
