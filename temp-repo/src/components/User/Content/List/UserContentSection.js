import React, { useEffect, useState } from "react";

import classes from "./UserContentSection.module.css";

import ContentSectionListItem from "./ContentSectionListItem";

const getAllWebhooks = async () => {
  return fetch("https://me-serter.jotform.dev/intern-api/getAllWebhooks").then(
    (res) => res.json()
  );
};

const WEBHOOKS = [
  {
    source: { appName: "Jotform", action: "Get Submission" },
    destination: { appName: "Telegram", action: "Send Message" },
  },
];

const UserContentSection = (props) => {
  const [webhooks, setWebhooks] = useState([]);

  useEffect(() => {
    const asyncHandler = async () => {
      const res = await getAllWebhooks();
      console.log(JSON.parse(res.content[0].value));
    };
    asyncHandler();
  }, []);

  return (
    <div className={classes["content--list"]}>
      <div className={classes["content--list-wrapper"]}>
        {webhooks.length !== 0 &&
          webhooks.map((e) => {
            return <ContentSectionListItem webhook={e} />;
          })}
        {webhooks.length === 0 && "..."}
      </div>
    </div>
  );
};

export default UserContentSection;
