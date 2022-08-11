import React from "react";

import classes from "./InputContainer.module.css";

const InputContainer = (props) => {
  return (
    <div
      key={props.key}
      className={`${classes["input--container"]} border-b border-solid py-5 ${
        props.inputType === "checkbox" && "flex gap-1"
      }`}
    >
      <label
        className={
          props.labelClassName ||
          `block text-sm font-semibold ${
            props.inputType !== "checkbox" && "mb-2"
          }`
        }
      >
        {props.inputLabel}
      </label>
      <input
        className={`${
          props.inputType !== "checkbox" && "h-10 w-full px-3 mt-2"
        } radius border border-solid block border-navy-100 relative bg-white z-2 duration-300 font-circular focus:border-blue-300`}
        type={props.inputType}
        required
        checked={props.inputType === "checkbox" && props.default}
        value={props.default || ""}
        onChange={(e) => {
          if (props.inputType === "checkbox") props.setter(!props.default);
          else props.setter(e.target.value);
        }}
      />
    </div>
  );
};

export default InputContainer;
