import React from "react";
import { MixedTags } from "@yaireo/tagify/dist/react.tagify";

import classes from "./TagInputContainer.module.css";

const TagInputContainer = (props) => {
  const settings = {
    pattern: /@/,
    dropdown: {
      enabled: 1,
      position: "text",
    },
    whitelist: props.whitelist,
    // whitelist: [
    //   { id: 100, value: "kenny" },
    //   { id: 101, value: "cartman", title: "Eric Cartman" },
    //   { id: 102, value: "kyle", title: "Kyle Broflovski" },
    //   { id: 103, value: "token", title: "Token Black" },
    //   { id: 104, value: "jimmy", title: "Jimmy Valmer" },
    //   { id: 105, value: "butters", title: "Butters Stotch" },
    //   { id: 106, value: "stan", title: "Stan Marsh" },
    //   { id: 107, value: "randy", title: "Randy Marsh" },
    //   { id: 108, value: "Mr. Garrison", title: "POTUS" },
    //   { id: 109, value: "Mr. Mackey", title: "M'Kay" },
    // ],
  };

  console.log(settings);

  return (
    <div className={classes["tag-input"]}>
      <label>{props.label}</label>
      <MixedTags
        autoFocus={true}
        settings={settings}
        className="myTags"
        onChange={(e) => props.onChange(e.detail.value)}
        value={props.defaultValue}
      />
    </div>
  );
};

export default TagInputContainer;
