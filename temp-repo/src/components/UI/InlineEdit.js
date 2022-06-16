import React, { useState, useEffect, useRef } from "react";

import classes from "./InlineEdit.module.css";

const InlineEdit = ({ value, setValue, style }) => {
  const [editingValue, setEditingValue] = useState(value);

  const inputRef = useRef(null);

  useEffect(() => {
    setEditingValue(value);
  }, [value]);

  const onChange = (event) => setEditingValue(event.target.value);

  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Escape") {
      event.target.blur();
    }
  };

  const onBlur = (event) => {
    if (event.target.value.trim() === "") {
      setEditingValue(value);
    } else {
      setValue(event.target.value);
    }
  };

  return (
    <input
      style={style}
      className={classes["inline-edit"]}
      ref={inputRef}
      type="text"
      aria-label="Field name"
      value={editingValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  );
};

export default InlineEdit;
