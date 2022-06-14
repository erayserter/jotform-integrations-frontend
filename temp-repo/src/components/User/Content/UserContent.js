import React, { useState, useEffect } from "react";
import { usePopper } from "react-popper";

import useOnClickOutside from "../../Hooks/useOnClickOutside";

import classes from "./UserContent.module.css";

import UserContentNavigationItem from "./UserContentNavigationItem";
import UserContentSection from "./List/UserContentSection";
import Templates from "./List/Templates/Templates";
import { useRef } from "react";

const LIST_ITEMS = [
  { header: "Integrations", value: "Integrations" },
  { header: "Templates", value: "Templates" },
  { header: "Keys", value: "Keys" },
  { header: "Favorites", value: "Favorite Integrations" },
  { header: "Trash", value: "Deleted Integrations" },
];

const SORT_LIST_ITEMS = [
  "Title [a-z]",
  "Title [z-a]",
  "Creation Date",
  "Last Edit",
  "Submission Count",
  "Unread",
  "Last Submission",
];

const UserContent = (props) => {
  const [sectionContent, setSectionContent] = useState(LIST_ITEMS[0]);
  const [searchedWord, setSearchedWord] = useState("");

  const [isSortingPopperOpen, setIsSortingPopperOpen] = useState(false);
  const [sortedItemsBy, setSortedItemsBy] = useState(SORT_LIST_ITEMS[0]);

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
  });

  const ref = useRef();

  useOnClickOutside(ref, () => {
    setIsSortingPopperOpen(false);
  });

  const sectionContentHandler = (content) => {
    setSectionContent(content);
  };

  const clickHandler = (event) => {
    props.onNewIntegration(true);
  };

  const hasEnabled =
    props.webhooks.filter((e) => {
      return (
        props.selectedWebhooks.includes(e.webhook_id) &&
        e.status.toLowerCase() === "enabled"
      );
    }).length !== 0;

  const hasDisabled =
    props.webhooks.filter((e) => {
      return (
        props.selectedWebhooks.includes(e.webhook_id) &&
        e.status.toLowerCase() === "disabled"
      );
    }).length !== 0;

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
                display: props.selectedWebhooks.length !== 0 ? "flex" : "none",
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
              {sectionContent.header === "Trash" && (
                <div className={classes["trash-menu-only"]}>
                  <button
                    className={classes["user--restore"]}
                    onClick={(event) => {
                      props.onStatusChangeWebhook("enable");
                    }}
                  >
                    <span>Restore</span>
                  </button>
                </div>
              )}
              {sectionContent.header !== "Trash" && (
                <div className={classes["integrations-menu"]}>
                  <button
                    className={`${classes["user--disable"]} ${
                      !hasEnabled && classes["user--isDisabled"]
                    }`}
                    onClick={(event) => {
                      props.onStatusChangeWebhook("disable");
                    }}
                  >
                    <span>Disable</span>
                  </button>
                  <button
                    className={`${classes["user--enable"]} ${
                      !hasDisabled && classes["user--isDisabled"]
                    }`}
                    onClick={(event) => {
                      props.onStatusChangeWebhook("enable");
                    }}
                  >
                    <span>Enable</span>
                  </button>
                </div>
              )}
            </div>
            <div className={classes["user--sectionsearch"]}>
              <div className={classes["user--sectionsearch-sort"]}>
                <div
                  className={classes["user--sectionsearch-sort-wrapper"]}
                  ref={ref}
                >
                  <button
                    ref={setReferenceElement}
                    onClick={(event) => {
                      setIsSortingPopperOpen((prev) => !prev);
                    }}
                    className={
                      isSortingPopperOpen && classes["user--sort-button-active"]
                    }
                  >
                    <span>Title [a-z]</span>
                  </button>
                  {isSortingPopperOpen && (
                    <div
                      className={classes["user--sort-popper"]}
                      ref={setPopperElement}
                      style={styles.popper}
                      {...attributes.popper}
                    >
                      <ul className={classes["user--sort-popper-list"]}>
                        {SORT_LIST_ITEMS.map((e) => {
                          return (
                            <li
                              className={
                                sortedItemsBy === e &&
                                classes["active-sort-choice"]
                              }
                              key={e}
                              onClick={(event) => {
                                setSortedItemsBy(e);
                                setIsSortingPopperOpen(false);
                              }}
                            >
                              {e}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className={classes["user--sectionsearch-input"]}>
                <input
                  type="text"
                  placeholder="Search Integration"
                  onChange={(event) => {
                    setSectionContent(LIST_ITEMS[0]);
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
            selectedWebhooks={props.selectedWebhooks}
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
