import React, { useEffect, useState } from "react";

import classes from "./UserContentSection.module.css";

import ContentSectionListItem from "./ContentSectionListItem";

const getAllWebhooks = async () => {
  return fetch("https://me-serter.jotform.dev/intern-api/getAllWebhooks").then(
    (res) => res.json()
  );
};

const UserContentSection = (props) => {
  const [webhooks, setWebhooks] = useState([]);

  useEffect(() => {
    const asyncHandler = async () => {
      const res = await getAllWebhooks();
      if (res.responseCode === 200) setWebhooks(res.content);
    };
    asyncHandler();
  }, []);

  return (
    <div className={classes["content--list"]}>
      <div className={classes["content--list-wrapper"]}>
        {webhooks.length !== 0 &&
          webhooks
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
                />
              );
            })}
        {webhooks.length === 0 && "..."}
      </div>
    </div>
  );
};

export default UserContentSection;
