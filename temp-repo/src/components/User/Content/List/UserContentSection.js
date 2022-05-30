import React from "react";

import classes from "./UserContentSection.module.css";

import ContentSectionListItem from "./ContentSectionListItem";

const UserContentSection = (props) => {
  return (
    <div className={classes["content--list"]}>
      <div className={classes["content--list-wrapper"]}>
        <ContentSectionListItem />
      </div>
    </div>
  );
};

export default UserContentSection;
