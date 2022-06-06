import React from "react";

import classes from "./UserContentNavigationItem.module.css";

const UserContentNavigationItem = (props) => {
  const clickHandler = (event) => {
    props.sectionChange(props.item);
  };

  return (
    <button className={classes["navigation--button"]} onClick={clickHandler}>
      {props.item.header}
    </button>
  );
};

export default UserContentNavigationItem;
