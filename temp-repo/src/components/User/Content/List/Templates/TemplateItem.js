import React from "react";

import classes from "./TemplateItem.module.css";

const TemplateItem = (props) => {
  const source_app = props.datas.source;
  const destination_app = props.datas.destination;

  return (
    <div
      className={`${classes["template-item--container"]} bg-navy-25 border border-solid border-navy-100 radius pt-8 px-1 flex flex-col text-center h-48 w-60`}
    >
      <div
        className={`${classes["template-item--images"]} flex justify-center items-center`}
      >
        <div className={`${classes["image-container"]} flex gap-2 relative`}>
          <img
            className={classes["image-containter__source"]}
            width="60"
            height="60"
            src={source_app.img}
            alt={source_app.name}
          />
          <img
            className={classes["image-container__destination"]}
            width="60"
            height="60"
            src={destination_app.img}
            alt={destination_app.name}
          />
        </div>
      </div>
      <div
        className={`${classes["template-item--app-names"]} flex justify-center items-center gap-1 mt-4`}
      >
        <h5 className="text-sm font-semibold line-height-lg overflow-hidden whitespace-nowrap">
          {source_app.name}
        </h5>
        +
        <h5 className="text-sm font-semibold line-height-lg overflow-hidden whitespace-nowrap">
          {destination_app.name}
        </h5>
      </div>
      <p
        className={`${classes["template-item--paragraph"]} inline-block mt-1 px-4 overflow-hidden text-xs line-height-sm`}
      >
        When {source_app.trigger}, {destination_app.action}
      </p>
    </div>
  );
};

export default TemplateItem;
