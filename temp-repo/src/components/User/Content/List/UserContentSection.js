import React from "react";

import classes from "./UserContentSection.module.css";

import ContentSectionListItem from "./ContentSectionListItem";

const UserContentSection = (props) => {
  const askedContent = props.webhooks.filter((m) => {
    if (props.content.header === "Integrations")
      return m.status === "ENABLED" || m.status === "DISABLED";
    if (props.content.header === "Trash") return m.status === "DELETED";
    if (props.content.header === "Favorites")
      return m.status !== "DELETED" && Number(m["is_favorite"]) === 1;
    return false;
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
              <div className={classes["content--no-content-icon"]}>
                {/* {props.content.header === "Trash" && (
                  <div className={classes["no-trash-tooltip"]}>
                    <svg
                      class="lsApp-noForms-icon-tip-arrow"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="14"
                      fill="none"
                      viewBox="0 0 12 14"
                    >
                      <path
                        fill="currentColor"
                        d="M6.822.822a1 1 0 00-1.397 0L.707 5.432a1 1 0 00-.085 1.336l4.718 5.95a1 1 0 001.567 0l4.718-5.95a1 1 0 00-.085-1.337L6.822.821z"
                      ></path>
                    </svg>
                  </div>
                )}
                {props.content.header === "Favorites" && (
                  <div className={classes["no-favorites-tooltip"]}></div>
                )} */}
              </div>
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
