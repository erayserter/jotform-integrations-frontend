import React from "react";

import classes from "./TemplateItem.module.css";

const TemplateItem = (props) => {
  const source_app = props.datas.source_item;
  const destination_app = props.datas.destination_item;
  const trigger = props.datas.trigger;
  const action = props.datas.action;

  return (
    <div
      className={`bg-navy-25 border border-solid border-navy-100 radius pt-8 px-1 flex flex-col text-center h-48 w-60`}
    >
      <div className={`flex justify-center items-center`}>
        <div className={`flex gap-2 relative`}>
          <img
            width="60"
            height="60"
            src={source_app.url}
            alt={source_app.id}
          />
          <img
            width="60"
            height="60"
            src={destination_app.url}
            alt={destination_app.id}
          />
        </div>
      </div>
      <div
        className={`${classes["template-item--app-names"]} flex justify-center items-center gap-1 mt-4`}
      >
        <h5 className="text-sm font-semibold line-height-lg overflow-hidden whitespace-nowrap line-clamp-1">
          {source_app.id}
        </h5>
        +
        <h5 className="text-sm font-semibold line-height-lg overflow-hidden whitespace-nowrap line-clamp-1">
          {destination_app.id}
        </h5>
      </div>
      <p
        className={`inline-block mt-1 px-4 overflow-hidden text-xs line-height-sm line-clamp-1`}
      >
        When {trigger.name}, {action.name}
      </p>
    </div>
  );
};

export default TemplateItem;
