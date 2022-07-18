import React from "react";

import classes from "./IntegrationTitle.module.css";

import InlineEdit from "../../../UI/InlineEdit";

const IntegrationTitle = ({
  title,
  subtitle,
  isTitleInlineEdit,
  titleValue,
  titleSetValue,
  isSubtitleInlineEdit,
  subTitleValue,
  subTitleSetValue,
}) => {
  return (
    <div className={`${classes["integration-title"]} static p-0`}>
      {isTitleInlineEdit ? (
        <div
          className={`${classes["settingsInlineEdit"]} flex justify-center items-center`}
        >
          <InlineEdit
            value={titleValue}
            setValue={titleSetValue}
            isTitle={true}
          />
        </div>
      ) : (
        <h1 className=" text-center color-navy-700 font-semibold">{title}</h1>
      )}
      {isSubtitleInlineEdit ? (
        <div className={classes["settingsInlineEdit"]}>
          <InlineEdit
            value={subTitleValue}
            setValue={subTitleSetValue}
            isSubtitle={true}
          />
        </div>
      ) : (
        <h2 className="text-center color-navy-300 font-normal">{subtitle}</h2>
      )}
    </div>
  );
};

export default IntegrationTitle;
