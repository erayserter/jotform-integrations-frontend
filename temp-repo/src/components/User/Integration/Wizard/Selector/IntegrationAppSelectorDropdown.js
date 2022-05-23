import React, { Fragment, useRef, useState } from "react";

import useOnClickOutside from "../../../../Hooks/useOnClickOutside";

import classes from "./IntegrationAppSelectorDropdown.module.css";

import IntegrationAppAction from "./Apps/IntegrationAppAction";

const IntegrationAppSelectorDropdown = (props) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dropdownRef = useRef();

  useOnClickOutside(dropdownRef, () => {
    setDropdownVisible(false);
  });

  const dropdownHandler = (event) => {
    setDropdownVisible((prev) => !prev);
  };

  const actionSelectHandler = (id) => {
    props.onActionSelect(id);
    setDropdownVisible(false);
  };

  return (
    <div className={classes["app-dropdown"]} ref={dropdownRef}>
      <button className={classes["action-button"]} onClick={dropdownHandler}>
        <span>Select An Action.</span>
        <img
          src="https://img.icons8.com/ios-glyphs/90/000000/chevron-down.png"
          alt=""
        />
      </button>
      {dropdownVisible && (
        <ul className={classes["action-dropdown"]}>
          <IntegrationAppAction
            onActionSelect={actionSelectHandler}
            id={1}
            img="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
            actionName="A"
          />
          <IntegrationAppAction
            onActionSelect={actionSelectHandler}
            id={2}
            img="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
            actionName="B"
          />
          <IntegrationAppAction
            onActionSelect={actionSelectHandler}
            id={3}
            img="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
            actionName="C"
          />
          <IntegrationAppAction
            onActionSelect={actionSelectHandler}
            id={4}
            img="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
            actionName="D"
          />
        </ul>
      )}
    </div>
  );
};

export default IntegrationAppSelectorDropdown;
