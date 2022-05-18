import React, { forwardRef } from "react";

import classes from "./ModalBox.module.css";

import useOnClickOutside from "../Hooks/useOnClickOutside";

const ModalBox = forwardRef(function ModalBox(props, ref) {
  useOnClickOutside(ref, () => props.onIntegrationChoice(false));

  return (
    <div className={classes["modalbox"]}>
      <div className={classes["modal-content"]} ref={ref}>
        {props.children}
      </div>
    </div>
  );
});

export default ModalBox;
