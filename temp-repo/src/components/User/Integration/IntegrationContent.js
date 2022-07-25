import React, { useState, useEffect } from "react";

import classes from "./IntegrationContent.module.css";

import IntegrationWizard from "./Wizard/IntegrationWizard";
import IntegrationHeader from "./Header/IntegrationHeader";
import Templates from "../Content/List/Templates/Templates";

const IntegrationContent = (props) => {
  const [currentContent, setCurrentContent] = useState("choice");

  useEffect(() => {
    if (props.isUpdate || props.isTemplate) setCurrentContent("wizard");
  }, [props.isUpdate, props.isTemplate]);

  return (
    <div
      className={`${classes["container"]} flex flex-col items-center bg-white fixed font-circular top-0 right-0 left-0 bottom-0 min-h-auto color-navy-700 md:min-h-sm md:relative`}
    >
      <div
        className={`${classes["content-wrapper"]} flex flex-col my-0 mx-auto overflow-x-hidden overflow-y-auto`}
      >
        {currentContent === "choice" && (
          <IntegrationHeader onSelect={setCurrentContent} />
        )}
        {currentContent === "wizard" && (
          <IntegrationWizard
            appSettingsInitial={props.appSettingsInitial}
            onIntegrationSave={props.onIntegrationSave}
            apiStatus={props.apiStatus}
            isUpdate={props.isUpdate}
            isTemplate={props.isTemplate}
            oldContent={props.oldContent}
          />
        )}
      </div>
      {currentContent === "template" && (
        <div className="h-full w-full mt-16">
          <Templates onTemplateSelect={props.onTemplateSelect} />
        </div>
      )}
      <button
        className={`${classes["closeButton"]} absolute cursor-pointer top-4 right-4 md:top-5 md:right-5 p-3 m-0 bg-navy-75 radius-full`}
        onClick={props.onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 17 16"
          width="16"
          height="16"
        >
          <path
            d="M9.514 8l6.438-6.408a.933.933 0 10-1.32-1.319L8.225 6.711 1.817.273a.933.933 0 00-1.319 1.32L6.936 8.03.498 14.408a.933.933 0 101.32 1.319l6.437-6.438 6.377 6.438a.933.933 0 001.32-1.32L9.514 8z"
            fill="#A8AAB5"
            fillRule="evenodd"
          ></path>
        </svg>
      </button>
      {!props.isUpdate && !props.isTemplate && currentContent !== "choice" && (
        <div
          className={`${classes["back-button-container"]} absolute top-5 left-4 md:left-5`}
          onClick={(event) => {
            setCurrentContent("choice");
          }}
        >
          <button
            className={`${classes["back-button-container__button"]} flex items-center justify-center m-0 bg-navy-75 h-10vw max-h-10 duration-300 cursor-pointer border-0 max-w-full px-3 w-full`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 26 19"
              class="backButton-svg"
              width="17"
              height="19"
            >
              <path
                d="M10.296 16.317a1.286 1.286 0 010 1.834 1.315 1.315 0 01-1.832 0l-7.68-7.686A1.318 1.318 0 01.4 9.53c0-.366.147-.697.384-.936L8.464.908a1.283 1.283 0 011.832 0 1.286 1.286 0 010 1.834L4.798 8.228h19.52A1.29 1.29 0 0125.6 9.529c0 .715-.568 1.284-1.283 1.284H4.8l5.497 5.504z"
                fill="#A0A3AF"
              ></path>
            </svg>
            <span
              className={`${classes["back-button-container__text"]} border-navy-300 font-medium line-height-sm ml-2 text-uppercase`}
            >
              back
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default IntegrationContent;
