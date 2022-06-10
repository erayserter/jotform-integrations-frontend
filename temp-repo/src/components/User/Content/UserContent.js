import React, { useState, useEffect } from "react";

import classes from "./UserContent.module.css";

import UserContentNavigationItem from "./UserContentNavigationItem";
import UserContentSection from "./List/UserContentSection";
import Templates from "./List/Templates/Templates";

const LIST_ITEMS = [
  { header: "Integrations", value: "Integrations" },
  { header: "Templates", value: "Templates" },
  { header: "Keys", value: "Keys" },
  { header: "Favorites", value: "Favorite Integrations" },
  { header: "Trash", value: "Deleted Integrations" },
];

const UserContent = (props) => {
  const [sectionContent, setSectionContent] = useState(LIST_ITEMS[0]);
  const [searchedWord, setSearchedWord] = useState("");

  const sectionContentHandler = (content) => {
    setSectionContent(content);
  };

  const clickHandler = (event) => {
    props.onNewIntegration(true);
  };

  return (
    <main className={classes["user--main"]}>
      <div className={classes["user--navigation"]}>
        <div className={classes["user--sidebarbutton"]}>
          <button onClick={clickHandler}>Create New Integration</button>
        </div>
        <div className={classes["user--sidebarmenu"]}>
          <h2>My Integrations</h2>
          <ul>
            {LIST_ITEMS.map((item) => {
              return (
                <li key={item.header}>
                  <UserContentNavigationItem
                    item={item}
                    current={sectionContent}
                    sectionChange={sectionContentHandler}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={classes["user--section-content"]}>
        <div className={classes["user--section-toolbar"]}>
          <div className={classes["user--section-toolbar-wrapper"]}>
            <div
              className={classes["user--selection-menu"]}
              style={{
                display: props.selectedWebhooks.length !== 0 ? "block" : "none",
              }}
            >
              <button
                className={classes["user--trash"]}
                onClick={(event) => {
                  if (sectionContent.header === "Trash")
                    props.onStatusChangeWebhook("purge");
                  else props.onStatusChangeWebhook("delete");
                }}
              ></button>
            </div>
            <div className={classes["user--sectionsearch"]}>
              <div className={classes["user--sectionsearch-sort"]}>
                <div className={classes["user--sectionsearch-sort-wrapper"]}>
                  <button>
                    <span>Title [a-z]</span>
                  </button>
                </div>
              </div>
              <div className={classes["user--sectionsearch-input"]}>
                <input
                  type="text"
                  placeholder="Search Integration"
                  onChange={(event) => {
                    setSearchedWord(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {sectionContent.header === "Templates" ? (
          <Templates
            onTemplateSelect={props.onTemplateSelect}
            apps={props.apps}
          />
        ) : (
          <UserContentSection
            apps={props.apps}
            onIntegrationUpdate={props.onIntegrationUpdate}
            webhooks={props.webhooks}
            content={sectionContent}
            searchedWord={searchedWord}
            onSelect={props.onSelect}
            onFavorite={props.onFavorite}
            onStatusChangeWebhook={props.onStatusChangeWebhook}
          />
        )}
      </div>
    </main>
  );
};

export default UserContent;
