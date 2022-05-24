import React from "react";

import classes from "./IntegrationAppCard.module.css";

const IntegrationAppCard = (props) => {
  const clickHandler = (event) => {
    props.onClick(true, props.type);
  };

  console.log(props.apps[props.datas[0] - 1]);

  return (
    <div className={classes["container"]} onClick={clickHandler}>
      <div className={classes["card"]}>
        {props.datas[0] ? (
          <img
            src={props.apps[props.datas[0] - 1].img}
            width="90"
            height="90"
          />
        ) : (
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 54 54"
            className="jfWizard-list-item-icon-svg"
            width="53"
            height="51"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.25 24.75h22.5V2.25a2.25 2.25 0 014.5 0v22.5h22.5a2.25 2.25 0 010 4.5h-22.5v22.5a2.25 2.25 0 01-4.5 0v-22.5H2.25a2.25 2.25 0 010-4.5z"
              fill="#6F76A7"
            ></path>
          </svg>
        )}
      </div>
      <div className={classes["text"]}>{props.type}</div>
    </div>
  );
};

export default IntegrationAppCard;
