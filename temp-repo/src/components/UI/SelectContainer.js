import React from "react";

import classes from "./SelectContainer.module.css";

const SelectContainer = (props) => {
  return (
    <div className={classes["select"]}>
      <span>{props.label}</span>
      <Select
        className="basic-single"
        classNamePrefix="select"
        isClearable={true}
        isSearchable={true}
        name="actions"
        options={
          props.type === "source"
            ? app.triggers.map((e) => {
                return { value: e, label: e };
              })
            : app.actions.map((e) => {
                return { value: e, label: e };
              })
        }
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        menuPortalTarget={document.body}
        menuPlacement="bottom"
        onChange={(e) => {
          actionSelectHandler(e.value);
        }}
        defaultValue={
          selectedApp.action !== "" && {
            value: selectedApp.action,
            label: selectedApp.action,
          }
        }
      />
    </div>
  );
};

export default SelectContainer;
