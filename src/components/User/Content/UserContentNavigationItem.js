import React from "react";

import classes from "./UserContentNavigationItem.module.css";

const UserContentNavigationItem = (props) => {
  const clickHandler = (event) => {
    props.sectionChange(props.item);
  };

  return (
    <button
      className={`${classes["navigation--button"]} ${
        props.current.header === props.item.header
          ? "bg-navy-100"
          : "bg-navy-25"
      } cursor-pointer border border-solid border-navy-25 radius text-left py-3 px-4 my-4 w-full duration-300 hover:border-navy-100 hover:bg-navy-100`}
      onClick={clickHandler}
    >
      {props.item.header}
    </button>
  );
};

export default UserContentNavigationItem;
