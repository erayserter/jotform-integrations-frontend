import React, { useState, useEffect } from "react";

import classes from "./UserContent.module.css";
import UserContentNavigationItem from "./UserContentNavigationItem";

import UserContentSection from "./List/UserContentSection";

const LIST_ITEMS = [
  { header: "Integrations", value: "Integrations" },
  { header: "Templates", value: "Templates" },
  { header: "Keys", value: "Keys" },
  { header: "Favorites", value: "Favorite Integrations" },
  { header: "Trash", value: "Deleted Integrations" },
];

const getWebhookRequest = async () => {
  return fetch("https://me-serter.jotform.dev/intern-api/getAllWebhooks").then(
    (res) => res.json()
  );
};

const postWebhookRequest = async (credentials) => {
  return await fetch("https://me-serter.jotform.dev/intern-api/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

const UserContent = (props) => {
  const [sectionContent, setSectionContent] = useState(LIST_ITEMS[0]);
  const [searchedWord, setSearchedWord] = useState("");

  const [webhooks, setWebhooks] = useState([]);
  const [haveSelected, setHaveSelected] = useState(false);
  const [selectedWebhooks, setSelectedWebhooks] = useState({});

  const getWebhooks = async () => {
    const res = await getWebhookRequest();
    if (res.responseCode === 200) {
      setWebhooks(res.content);
      for (const webhook in res.content) {
        setSelectedWebhooks((prev) => {
          return { ...prev, [webhook["webhook_id"]]: false };
        });
      }
    }
    setHaveSelected(false);
  };

  useEffect(() => {
    getWebhooks();
  }, []);

  const selectWebhookHandler = (webhookID, bool) => {
    setSelectedWebhooks((prev) => {
      let have = false;
      const updatedSelectedWebhooks = { ...prev, [webhookID]: bool };
      for (const webhook in updatedSelectedWebhooks)
        have = have || updatedSelectedWebhooks[webhook];
      setHaveSelected(have);
      return updatedSelectedWebhooks;
    });
  };

  const sectionContentHandler = (content) => {
    setSectionContent(content);
  };

  const clickHandler = (event) => {
    props.onNewIntegration(true);
  };

  const deleteWebhookHandler = async (event) => {
    const credentials = { webhook_id: [], action: "delete" };
    for (const webhook in selectedWebhooks)
      if (webhook)
        if (selectedWebhooks[webhook]) credentials.webhook_id.push(webhook);

    const res = await postWebhookRequest(credentials);
    getWebhooks();
  };

  const favoriteWebhookHandler = async (webhook, bool) => {
    const credentials = {
      webhook_id: webhook,
      is_favorite: bool,
      action: "favorite",
    };
    const res = await postWebhookRequest(credentials);
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
              style={{ display: haveSelected ? "block" : "none" }}
            >
              <button
                className={classes["user--trash"]}
                onClick={deleteWebhookHandler}
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
        <UserContentSection
          onIntegrationUpdate={props.onIntegrationUpdate}
          content={sectionContent}
          searchedWord={searchedWord}
          onSelect={selectWebhookHandler}
          webhooks={webhooks}
          onFavorite={favoriteWebhookHandler}
        />
      </div>
    </main>
  );
};

export default UserContent;
