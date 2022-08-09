import React from "react";

import classes from "./InputContainer.module.css";

const InputContainer = (props) => {
  return (
    <div
      key={props.key}
      className={`${classes["input--container"]} border-b border-solid py-5`}
    >
      <label
        className={props.labelClassName || "block mb-2 text-sm font-semibold"}
      >
        {props.inputLabel}
      </label>
      <input
        className="radius h-10 border border-solid block border-navy-100 w-full px-3 mt-2 relative bg-white z-2 duration-300 font-circular focus:border-blue-300"
        type={props.inputType}
        required
        value={props.default || ""}
        onChange={(e) => props.setter(e.target.value)}
        onBlur={props.onBlur}
      />
    </div>
  );
};

export default InputContainer;
