import React from "react";
import { MixedTags } from "@yaireo/tagify/dist/react.tagify";

import classes from "./TagInputContainer.module.css";

const settings = {
  pattern: /@/,
  dropdown: {
    enabled: 1,
    position: "text",
  },
};

const TagInputContainer = (props) => {
  return (
    <div className={classes["tag-input"]}>
      <label>{props.label}</label>
      <MixedTags
        autoFocus={true}
        settings={{ ...settings, whitelist: props.whitelist }}
        className="myTags"
        onChange={(e) => props.onChange(e.detail.value)}
        value={props.defaultValue}
      />
    </div>
  );
};

export default TagInputContainer;
