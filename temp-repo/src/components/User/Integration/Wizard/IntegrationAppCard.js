import React from "react";
import { useSelector } from "react-redux";

import classes from "./IntegrationAppCard.module.css";

import { useSelector } from "react-redux";
const IntegrationAppCard = (props) => {
  const apps = useSelector((state) => state.apps.apps);

  let app;
  if (props.datas && props.datas.id)
    app = Object.values(apps).find((app) => app.id === props.datas.id);

  const isUpdate = useSelector((state) => state.ui.isUpdate);
  const clickHandler = (event) => {
    props.onClick(props);
  };

  return (
    <div
      className={`${classes["container"]} ${
        !props.first && classes["mobile-card"]
      } flex md:block items-center bg-gray-25 md:bg-transparent m-0 radius-md cursor-pointer relative duration-300 ease-in-out w-full`}
      onClick={clickHandler}
    >
      <div
        className={`${classes["card"]} flex items-center justify-center radius-md relative duration-300 md:min-w-0`}
      >
        <div
          className={`${classes["card-wrapper"]} ${
            isUpdate && !props.isValid && classes["invalidApp"]
          } radius border-0 flex items-center justify-center absolute top-0 left-0 bottom-0 right-0 h-full border-solid border-transparent bg-navy-100 w-full duration-300`}
        >
          {app ? (
            <img
              className="h-2/3 w-2/3 max-h-full max-w-full md:w-auto md:h-auto"
              src={app.url}
              width="53"
              height="51"
            />
          ) : (
            <>
              {props.img ? (
                props.img
              ) : (
                <svg
                  className="h-2/3 w-2/3 max-h-full max-w-full md:w-auto md:h-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 54 54"
                  width="53"
                  height="51"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.25 24.75h22.5V2.25a2.25 2.25 0 014.5 0v22.5h22.5a2.25 2.25 0 010 4.5h-22.5v22.5a2.25 2.25 0 01-4.5 0v-22.5H2.25a2.25 2.25 0 010-4.5z"
                    fill="#6F76A7"
                  ></path>
                </svg>
              )}
            </>
          )}
        </div>
      </div>
      <div
        className={`${classes["text__container"]} ${
          isUpdate && !props.isValid && classes["invalidApp"]
        } w-full`}
      >
        <div
          className={`${classes["text"]} flex flex-col grow-1 text-left font-medium duration-300`}
        >
          {props.text}
        </div>
        <div
          className={`${classes["sub-text"]} grow-1 text-left color-navy-300`}
        >
          {props.subtext}
        </div>
      </div>
    </div>
  );
};

export default IntegrationAppCard;
