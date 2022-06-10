import React, { useEffect, useState } from "react";

import classes from "./UserContentNavigationItem.module.css";

const UserContentNavigationItem = (props) => {
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    setActivePage(props.current);
  }, [props.current]);

  const clickHandler = (event) => {
    props.sectionChange(props.item);
  };

  return (
    <button
      className={`${classes["navigation--button"]} ${
        props.current.header === props.item.header ? classes["isActive"] : ""
      }`}
      onClick={clickHandler}
    >
      {props.item.header}
    </button>
  );
};

export default UserContentNavigationItem;
