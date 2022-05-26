import React from "react";

import classes from "./InputContainer.module.css";

const InputContainer = (props) => {
  return (
    <div className={classes["input--container"]}>
      <label>{props.inputLabel}</label>
      <input
        type={props.inputType}
        required
        value={props.default || ""}
        onChange={(e) =>
          props.setter(props.inputLabel, props.inputType, e.target.value)
        }
      />
    </div>
  );
};

export default InputContainer;
