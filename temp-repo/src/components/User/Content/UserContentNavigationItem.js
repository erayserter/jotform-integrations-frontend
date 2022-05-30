import React from "react";

const UserContentNavigationItem = (props) => {
  const clickHandler = (event) => {
    props.sectionChange(props.title);
  };

  return <button onClick={clickHandler}>{props.title}</button>;
};

export default UserContentNavigationItem;
