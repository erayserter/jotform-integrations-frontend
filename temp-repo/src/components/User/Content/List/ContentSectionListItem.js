import React from "react";

import classes from "./ContentSectionListItem.module.css";

const ContentSectionListItem = (props) => {
  return (
    <div className={classes["content--list-item"]}>
      <div
        className={[
          classes["content--list-item-sections"],
          classes["content--list-item-checkbox"],
        ].join(" ")}
      >
        <div>
          <input type="checkbox"></input>
          <label></label>
        </div>
      </div>
      <div className={classes["content--list-item-sections"]}>
        <div className={classes["content--list-item-favorite-icon"]}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              fill="currentColor"
              d="M9.538 1.11a.5.5 0 01.924 0l2.33 5.603a.5.5 0 00.422.307l6.05.485a.5.5 0
             01.285.878l-4.61 3.948a.5.5 0 00-.16.496l1.408 5.903a.5.5 0 01-.747.543l-5.18-3.164a.5.5
             0 00-.52 0l-5.18 3.164a.5.5 0 01-.747-.543l1.408-5.903a.5.5 0 00-.16-.496L.45 8.383a.5.5
             0 01.286-.878l6.049-.485a.5.5 0 00.422-.307l2.33-5.603z"
            ></path>
          </svg>
        </div>
      </div>
      <div className={classes["content--list-item-sections"]}>
        <div className={classes["content--list-item-integration-icon"]}>
          <span></span>
        </div>
      </div>
      <div className={classes["content--list-item-headline"]}>
        <div className={classes["content--list-item-headline-title"]}>
          <div className={classes["content--title"]}>Form</div>
        </div>
        <div className={classes["content--list-item-headline-desc"]}>
          <span>0 submissions</span>
        </div>
      </div>
    </div>
  );
};

export default ContentSectionListItem;
