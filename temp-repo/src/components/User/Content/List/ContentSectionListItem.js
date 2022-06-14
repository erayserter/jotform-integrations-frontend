import React, { useEffect, useState } from "react";

import classes from "./ContentSectionListItem.module.css";

const ContentSectionListItem = (props) => {
  const [isFavorite, setIsFavorite] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(Number(props.webhook["is_favorite"]));
  }, [props]);

  const favoriteHandler = (event) => {
    setIsFavorite((prev) => {
      let favorite = 0;
      if (prev === 0) favorite = 1;
      props.onFavorite(props.webhook.webhook_id, favorite);
      return favorite;
    });
  };

  return (
    <div
      className={classes["content--list-item"]}
      style={
        props.selectedWebhooks.includes(props.webhook["webhook_id"])
          ? { backgroundColor: "#edf8ff" }
          : {}
      }
    >
      <div className={classes["content--list-item-main"]}>
        <div
          className={[
            classes["content--list-item-sections"],
            classes["content--list-item-checkbox"],
          ].join(" ")}
        >
          <div>
            <input
              type="checkbox"
              onChange={() => {
                props.onSelect(props.webhook["webhook_id"]);
              }}
            ></input>
            <label
              className={
                props.selectedWebhooks.includes(props.webhook["webhook_id"])
                  ? classes["checked-label"]
                  : null
              }
            ></label>
          </div>
        </div>
        <div
          className={`${classes["content--list-item-sections"]} ${
            props.webhook.status.toLowerCase() === "disabled" &&
            classes["item-disable"]
          }`}
        >
          <div
            className={`${classes["content--list-item-favorite-icon"]} ${
              isFavorite && classes["favorite-isActive"]
            }`}
            onClick={favoriteHandler}
          >
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
        <div
          className={`${classes["content--list-item-sections"]} ${
            props.webhook.status.toLowerCase() === "disabled" &&
            classes["item-disable"]
          }`}
        >
          <div className={classes["content--list-item-integration-icon"]}>
            <img
              width="40"
              height="40"
              src={
                props.apps.filter(
                  (app) =>
                    app.name.toLowerCase() ===
                    props.webhook.value.source.app_name.toLowerCase()
                )[0].img
              }
            />
            <img
              width="40"
              height="40"
              src={
                props.apps.filter(
                  (app) =>
                    app.name.toLowerCase() ===
                    props.webhook.value.destination.app_name.toLowerCase()
                )[0].img
              }
            />
          </div>
        </div>
        <div
          className={`${classes["content--list-item-headline"]}  ${
            props.webhook.status.toLowerCase() === "disabled" &&
            classes["item-disable"]
          }`}
        >
          <div className={classes["content--list-item-headline-title"]}>
            <div className={classes["content--title"]}>
              {props.webhook.webhook_name === "Integration" ? (
                <span>
                  {props.webhook.value.source["app_name"]}
                  {"  "}
                  <img
                    src="https://img.icons8.com/ios-glyphs/30/undefined/right--v1.png"
                    width="15px"
                  />
                  {"  "}
                  {props.webhook.value.destination["app_name"]}
                </span>
              ) : (
                <span>{props.webhook.webhook_name}</span>
              )}
            </div>
          </div>
          <div className={classes["content--list-item-headline-desc"]}>
            <span>
              When {props.webhook.value.source["app_action"]} on{" "}
              {props.webhook.value.source["app_name"]},{" "}
              {props.webhook.value.destination["app_action"]} on{" "}
              {props.webhook.value.destination["app_name"]}
            </span>
          </div>
        </div>
      </div>
      <div className={classes["content--list-item-actions"]}>
        {props.webhook.status !== "DELETED" && (
          <button
            onClick={(event) => {
              setIsLoading(true);
              props.onIntegrationUpdate(props.webhook);
            }}
            className={classes["content--list-item-actions-edit"]}
          >
            {isLoading ? "..." : "Edit Integration"}
          </button>
        )}
        {props.webhook.status === "DELETED" && (
          <div className={classes["content--list-item-actions-deleted"]}>
            <button
              className={classes["purge"]}
              onClick={(event) => {
                props.onStatusChangeWebhook("purge", props.webhook.webhook_id);
              }}
            >
              Purge
            </button>
            <button
              className={classes["restore"]}
              onClick={(event) => {
                props.onStatusChangeWebhook("enable", props.webhook.webhook_id);
              }}
            >
              Restore
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentSectionListItem;
