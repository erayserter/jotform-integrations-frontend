import React from "react";

import classes from "./UserContentSection.module.css";

import ContentSectionListItem from "./ContentSectionListItem";

import { useSelector } from "react-redux";

const dummyArray = [...Array(10)];

const UserContentSection = (props) => {
  const webhooks = useSelector((state) => state.webhooks.webhooks);
  const askedContent = webhooks.filter((m) => {
    if (m.status !== "PURGED") {
      if (props.content.header === "Integrations")
        return m.status === "ENABLED" || m.status === "DISABLED";
      if (props.content.header === "Trash") return m.status === "DELETED";
      if (props.content.header === "Favorites")
        return m.status !== "DELETED" && Number(m["is_favorite"]) === 1;
    }
    return false;
  });

  if (props.webhooksLoading)
    return (
      <div className={`${classes["content--list"]} grow-1 h-full`}>
        <div
          className={`${classes["content--list-wrapper"]} w-full h-full flex flex-col py-1 px-0.5 md:py-4 md:px-5`}
        >
          {dummyArray.map((e) => (
            <div
              className={`flex justify-between items-center w-full h-8 radius-full bg-navy-25 mb-9`}
            ></div>
          ))}
        </div>
      </div>
    );

  return (
    <div className={`${classes["content--list"]} grow-1 h-full`}>
      <div
        className={`${classes["content--list-wrapper"]} w-full h-full flex flex-col py-1 px-0.5 md:py-4 md:px-5`}
      >
        {askedContent.length !== 0 &&
          askedContent
            .filter((m) => {
              return (
                m.value.source["app_name"]
                  .toLowerCase()
                  .includes(props.searchedWord.toLowerCase()) ||
                m.value.destination["app_name"]
                  .toLowerCase()
                  .includes(props.searchedWord.toLowerCase()) ||
                m.value.source["app_action"]
                  .toLowerCase()
                  .includes(props.searchedWord.toLowerCase()) ||
                m.value.destination["app_action"]
                  .toLowerCase()
                  .includes(props.searchedWord.toLowerCase()) ||
                (m.webhook_name &&
                  m.webhook_name
                    .toLowerCase()
                    .includes(props.searchedWord.toLowerCase()))
              );
            })
            .map((e) => {
              return (
                <ContentSectionListItem
                  key={e}
                  webhook={e}
                  onIntegrationUpdate={props.onIntegrationUpdate}
                  onSelect={props.onSelect}
                  onFavorite={props.onFavorite}
                  onStatusChangeWebhook={props.onStatusChangeWebhook}
                />
              );
            })}
        {askedContent.length === 0 && (
          <div
            className={`${classes["content--no-content"]} flex items-center justify-center grow-1 h-full py-4 px-5 relative mt-8 md:mt-0`}
          >
            <div
              className={`${classes["content--no-content-wrapper"]} line-height-xl text-center`}
            >
              <div
                className={`${classes["content--no-content-icon"]} bg-center bg-no-repeat inline-block relative mb-7 h-28 w-28`}
              ></div>
              <div
                className={`${classes["content--no-content-primary-text"]} text-lg font-medium text-uppercase mb-1 color-navy-700`}
              >
                YOU DON'T HAVE ANY {props.content.value} YET!
              </div>
              <div
                className={`${classes["content--no-content-secondary-text"]} mb-7 text-lg text-lowercase color-navy-300`}
              >
                Your {props.content.value} will appear here.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserContentSection;
