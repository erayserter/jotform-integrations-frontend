import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import classes from "./AppContainer.module.css";

import Navbar from "./Navbar/Navbar";
import UserContent from "./User/Content/UserContent";
import IntegrationContent from "./User/Integration/IntegrationContent";

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

const AppContainer = (props) => {
  const [webhooks, setWebhooks] = useState([]);
  const [selectedWebhooks, setSelectedWebhooks] = useState([]);

  const [isIntegrationContent, setIsIntegrationContent] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [oldContent, setOldContent] = useState({});

  const getWebhooks = async () => {
    const res = await getWebhookRequest();
    if (res.responseCode === 200) setWebhooks(res.content);
  };

  const selectWebhookHandler = (webhookID) => {
    if (selectedWebhooks.includes(webhookID))
      setSelectedWebhooks((prev) => prev.filter((e) => e !== webhookID));
    else setSelectedWebhooks((prev) => [...prev, webhookID]);
  };

  const deleteWebhookHandler = async (event) => {
    const credentials = { webhook_id: selectedWebhooks, action: "delete" };
    await postWebhookRequest(credentials);
    setWebhooks((prev) =>
      prev.map((e) => {
        if (selectedWebhooks.includes(e.webhook_id))
          return { ...e, status: "DELETED" };
        return e;
      })
    );
    setSelectedWebhooks([]);
  };

  const favoriteWebhookHandler = async (webhook, bool) => {
    const credentials = {
      webhook_id: webhook,
      is_favorite: bool,
      action: "favorite",
    };
    await postWebhookRequest(credentials);
    setWebhooks((prev) =>
      prev.map((e) => {
        if (e.webhook_id === webhook)
          return { ...e, is_favorite: bool.toString() };
        return e;
      })
    );
  };

  const integrationUpdateHandler = (webhook) => {
    setIsUpdate(true);
    setIsIntegrationContent(true);
    setOldContent(webhook);
  };

  const closeHandler = () => {
    setIsIntegrationContent(false);
    setIsUpdate(false);
    setOldContent({});
  };

  const integrationSaveHandler = async (data, isUpdate) => {
    const res = await postWebhookRequest(data);
    if (isUpdate) {
      setWebhooks((prev) =>
        prev.map((webhook) => {
          if (webhook.webhook_id === res.content.webhookId)
            return {
              ...webhook,
              value: { source: data.source, destination: data.destination },
            };
          return webhook;
        })
      );
    } else {
      setWebhooks((prev) => {
        return [
          ...prev,
          {
            webhook_id: res.content.webhookId,
            value: { source: data.source, destination: data.destination },
            status: "ENABLED",
            is_favorite: "0",
          },
        ];
      });
    }

    closeHandler();
  };

  useEffect(() => {
    getWebhooks();
  }, []);

  if (!props.isLoggedIn)
    return (
      <Navigate
        to={{
          pathname: "/login",
        }}
      />
    );

  return (
    <div className={classes["container"]}>
      <Navbar />
      {isIntegrationContent ? (
        <IntegrationContent
          onNewIntegration={setIsIntegrationContent}
          onClose={closeHandler}
          onIntegrationSave={integrationSaveHandler}
          update={isUpdate}
          oldContent={oldContent}
          webhooks={webhooks}
        />
      ) : (
        <UserContent
          onNewIntegration={setIsIntegrationContent}
          onIntegrationUpdate={integrationUpdateHandler}
          webhooks={webhooks}
          selectedWebhooks={selectedWebhooks}
          onDeleteWebhook={deleteWebhookHandler}
          onFavorite={favoriteWebhookHandler}
          onSelect={selectWebhookHandler}
        />
      )}
    </div>
  );
};

export default AppContainer;
