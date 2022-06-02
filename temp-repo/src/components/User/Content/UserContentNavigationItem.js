import React from "react";

import classes from "./UserContentNavigationItem.module.css";

const UserContentNavigationItem = (props) => {
  const clickHandler = (event) => {
    props.sectionChange(props.title);
  };

  return (
    <button className={classes["navigation--button"]} onClick={clickHandler}>
      {props.title}
    </button>
  );
};

export default UserContentNavigationItem;
