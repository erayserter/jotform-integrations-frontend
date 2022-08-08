import React, { useState, useEffect, useRef } from "react";

import classes from "./InlineEdit.module.css";

const InlineEdit = ({ value, setValue, isTitle, isSubtitle }) => {
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
    <div className="flex items-center justify-center">
      <input
        className={`${classes["inline-edit"]} ${isTitle && classes["title"]} ${
          isSubtitle && classes["subtitle"]
        } text-center border-0 bg-transparent font-semibold whitespace-nowrap overflow-hidden my-0 mr-1 color-navy-700 cursor-pointer line-clamp-1`}
        ref={inputRef}
        type="text"
        aria-label="Field name"
        value={editingValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
      <img src="../src/assets/edit.png" alt="edit" className="w-7" />
    </div>
  );
};

export default InlineEdit;
