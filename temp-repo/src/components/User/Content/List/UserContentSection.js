import React, { useEffect, useState } from "react";

import classes from "./UserContentSection.module.css";

import ContentSectionListItem from "./ContentSectionListItem";

const UserContentSection = (props) => {
  const askedContent = props.webhooks.filter((m) => {
    if (props.content.header === "Integrations")
      return m.status === "ENABLED" || m.status === "DISABLED";
    if (props.content.header === "Trash") return m.status === "DELETED";
    if (props.content.header === "Favorites")
      return m.status !== "DELETED" && m["is_favorite"] === 1;
  });

  return (
    <div className={classes["content--list"]}>
      <div className={classes["content--list-wrapper"]}>
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
                  .includes(props.searchedWord.toLowerCase())
              );
            })
            .map((e) => {
              return (
                <ContentSectionListItem
                  webhook={e}
                  onIntegrationUpdate={props.onIntegrationUpdate}
                  onSelect={props.onSelect}
                  onFavorite={props.onFavorite}
                />
              );
            })}
        {askedContent.length === 0 && (
          <div className={classes["content--no-content"]}>
            <div className={classes["content--no-content-wrapper"]}>
              <div className={classes["content--no-content-icon"]}></div>
              <div className={classes["content--no-content-primary-text"]}>
                YOU DON'T HAVE ANY {props.content.value} YET!
              </div>
              <div className={classes["content--no-content-secondary-text"]}>
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
