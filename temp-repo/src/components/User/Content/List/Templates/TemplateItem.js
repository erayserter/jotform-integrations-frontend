import React from "react";

import classes from "./TemplateItem.module.css";

const TemplateItem = (props) => {
  const source_app = props.datas.source;
  const destination_app = props.datas.destination;

  return (
    <div className={classes["template-item--container"]}>
      <div className={classes["template-item--images"]}>
        <div className={classes["image-container"]}>
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
      <div className={classes["template-item--app-names"]}>
        <h5>{source_app.name}</h5>+<h5>{destination_app.name}</h5>
      </div>
      <p className={classes["template-item--paragraph"]}>
        When {source_app.trigger}, {destination_app.action}
      </p>
    </div>
  );
};

export default TemplateItem;
