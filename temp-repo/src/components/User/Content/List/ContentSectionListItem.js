import React, { useEffect, useState } from "react";
import { useRef } from "react";

import classes from "./ContentSectionListItem.module.css";

import { useSelector } from "react-redux";

const ContentSectionListItem = (props) => {
  const selectedWebhooks = useSelector(
    (state) => state.webhooks.selectedWebhooks
  );

  const [isFavorite, setIsFavorite] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const itemTitleRef = useRef();

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
      className={`${classes["content--list-item"]} ${
        isLoading ? "bg-navy-25" : ""
      } flex justify-between items-center w-full h-16 radius-md hover:bg-navy-25`}
      style={
        selectedWebhooks.includes(props.webhook["webhook_id"])
          ? { backgroundColor: "#edf8ff" }
          : {}
      }
      onClick={(event) => {
        if (itemTitleRef && !itemTitleRef.current.contains(event.target))
          props.onSelect(props.webhook["webhook_id"]);
      }}
    >
      <div
        className={`${classes["content--list-item-main"]} flex cursor-pointer items-center h-full duration-300 py-3.5 px-6 grow-1`}
      >
        <div
          className={`${classes["content--list-item-sections"]} ${
            selectedWebhooks.includes(props.webhook["webhook_id"])
              ? "flex"
              : "hidden"
          } relative z-1 md:mr-4 md:flex w-20 md:w-auto ${
            classes["content--list-item-checkbox"]
          }`}
        >
          <input
            className="opacity-0 absolute h-6 w-6 cursor-pointer z-3"
            type="checkbox"
            onChange={() => {
              props.onSelect(props.webhook["webhook_id"]);
            }}
          ></input>
          <label className={`relative mr-6 h-6 `}>
            <div
              className={`${
                classes["check-icon-background"]
              } absolute w-4 h-4 radius top-1 left-0 duration-300 ease-in-out border-2 border solid ${
                selectedWebhooks.includes(props.webhook["webhook_id"]) &&
                classes["checked-label"]
              }`}
            />
            <div
              className={`${classes["check-icon"]} absolute opacity-100 duration-300 ease-in-out z-2 border-solid`}
            ></div>
          </label>
        </div>
        <div
          className={`${classes["content--list-item-sections"]} ${
            classes["content--list-item-favorite-icon-wrapper"]
          } relative z-1 mr-4 ${
            props.webhook.status.toLowerCase() === "disabled"
              ? "opacity-50"
              : ""
          }`}
        >
          <div
            className={`${classes["content--list-item-favorite-icon"]} ${
              isFavorite && classes["favorite-isActive"]
            } color-navy-100 inline-block duration-300 z-9`}
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
          className={`${
            classes["content--list-item-sections"]
          } relative z-1 mr-4 ${
            props.webhook.status.toLowerCase() === "disabled"
              ? "opacity-50"
              : ""
          }`}
        >
          <div
            className={`${classes["content--list-item-integration-icon"]} ${
              selectedWebhooks.includes(props.webhook["webhook_id"])
                ? "hidden"
                : "flex"
            } md:flex items-center justify-center`}
          >
            <img
              width="40"
              height="40"
              src={
                props.apps.find(
                  (app) =>
                    app.name.toLowerCase() ===
                    props.webhook.value.source.app_name.toLowerCase()
                ).img
              }
            />
            <img
              width="40"
              height="40"
              src={
                props.apps.find(
                  (app) =>
                    app.name.toLowerCase() ===
                    props.webhook.value.destination.app_name.toLowerCase()
                ).img
              }
            />
          </div>
        </div>
        <div
          className={`${classes["content--list-item-headline"]}  ${
            props.webhook.status.toLowerCase() === "disabled"
              ? "opacity-50"
              : ""
          } grow-1 shrink-1 min-w-0 flex flex-col items-start overflow-hidden`}
        >
          <div
            className={`${classes["content--list-item-headline-title"]} flex items-center whitespace-nowrap pointer-events-none`}
            ref={itemTitleRef}
            onClick={(event) => {
              setIsLoading(true);
              props.onIntegrationUpdate(props.webhook);
            }}
          >
            <div
              className={`${classes["content--title"]} inline-flex items-center text-lg font-medium py-0.5 px-1.5 mr-1 -ml-1.5 color-navy-700 overflow-hidden whitespace-nowrap`}
            >
              {props.webhook.webhook_name === "Integration" ||
              props.webhook.webhook_name === "" ? (
                <span className="overflow-hidden whitespace-nowrap text-capitalize">
                  {props.webhook.value.source["app_name"]}
                  {"  "}
                  <img
                    className="inline-block"
                    src="https://img.icons8.com/ios-glyphs/30/undefined/right--v1.png"
                    width="15px"
                  />
                  {"  "}
                  {props.webhook.value.destination["app_name"]}
                </span>
              ) : (
                <span className="overflow-hidden whitespace-nowrap text-capitalize">
                  {props.webhook.webhook_name}
                </span>
              )}
            </div>
          </div>
          <div
            className={`${classes["content--list-item-headline-desc"]} w-full text-sm font-medium overflow-hidden whitespace-nowrap text-capitalize mt-0.5`}
          >
            <span>
              When {props.webhook.value.source["app_action"]} on{" "}
              {props.webhook.value.source["app_name"]},{" "}
              {props.webhook.value.destination["app_action"]} on{" "}
              {props.webhook.value.destination["app_name"]}
            </span>
          </div>
        </div>
      </div>
      <div
        className={`${classes["content--list-item-actions"]} ${
          isLoading ? "md:flex items-center relative" : "md:hidden"
        } hidden h-full whitespace-nowrap mr-2`}
      >
        {props.webhook.status !== "DELETED" && (
          <button
            onClick={(event) => {
              setIsLoading(true);
              props.onIntegrationUpdate(props.webhook);
            }}
            className={`${classes["content--list-item-actions-edit"]} ${
              isLoading && classes["loading"]
            } cursor-pointer items-center inline-flex h-full justify-center px-5 bg-transparent text-sm font-medium relative pointer-events-auto opacity-100 min-w-25 z-1`}
          >
            <div
              className={`${classes["button-background"]} absolute opacity-0 duration-300 ease-in-out`}
            />
            Edit Integration
          </button>
        )}
        {props.webhook.status === "DELETED" && (
          <div
            className={`${classes["content--list-item-actions-deleted"]} h-full`}
          >
            <button
              className={`${classes["purge"]} cursor-pointer items-center inline-flex h-full justify-center px-5 bg-transparent text-sm font-medium relative pointer-events-auto opacity-100 min-w-25 z-1`}
              onClick={(event) => {
                props.onStatusChangeWebhook("purge", props.webhook.webhook_id);
              }}
            >
              <div
                className={`${classes["button-background"]} absolute opacity-0 duration-300 ease-in-out`}
              />
              Purge
            </button>
            <button
              className={`${classes["restore"]} cursor-pointer items-center inline-flex h-full justify-center px-5 bg-transparent text-sm font-medium relative pointer-events-auto opacity-100 min-w-25 z-1`}
              onClick={(event) => {
                props.onStatusChangeWebhook("enable", props.webhook.webhook_id);
              }}
            >
              <div
                className={`${classes["button-background"]} absolute opacity-0 duration-300 ease-in-out`}
              />
              Restore
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentSectionListItem;
