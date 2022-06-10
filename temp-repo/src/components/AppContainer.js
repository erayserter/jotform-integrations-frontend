import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import classes from "./AppContainer.module.css";

import Navbar from "./Navbar/Navbar";
import UserContent from "./User/Content/UserContent";
import IntegrationContent from "./User/Integration/IntegrationContent";

const APPS = [
  {
    id: 1,
    name: "Jotform",
    img: "https://www.jotform.com/resources/assets/svg/jotform-icon-transparent.svg",
    triggers: ["Get Submission"],
    actions: ["Temporary Jotform Action", "Temporary Jotform Action 2"],
  },
  {
    id: 2,
    name: "Telegram",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
    triggers: [],
    actions: ["Send Message", "Send Attachments"],
  },
  {
    id: 3,
    name: "ClickUp",
    img: "https://files.jotform.com/jotformapps/cde74cfb4f0ca88ebc50767e1e211553.png",
    triggers: ["Temporary ClickUp Trigger", "Temporary ClickUp Trigger 2"],
    actions: ["Create Action", "Create Subtask", "Create Comment"],
  },
];

const appSettingsInitial = {
  Jotform: {
    "Get Submission": [
      {
        label: "Choose Form",
        type: "Select",
        isMulti: false,
        selection: "form_id",
        data: [],
      },
    ],
  },
  Telegram: {
    "Send Message": [
      {
        label: "Chat ID",
        type: "text",
        selection: "chat_id",
        templateDefault: "8576375",
      },
      {
        label: "Text",
        selection: "text",
        type: "tagInput",
        whitelist: [],
      },
    ],
    "Send Attachments": [
      {
        label: "Chat ID",
        type: "text",
        selection: "chat_id",
        templateDefault: "8576375",
      },
      {
        label: "File Upload Field",
        type: "Select",
        isMulti: true,
        selection: "upload_fields",
        data: [],
      },
    ],
  },
};

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

async function validateApiKey(credentials) {
  return fetch("https://me-serter.jotform.dev/intern-api/validateApiKey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

const AppContainer = (props) => {
  const [webhooks, setWebhooks] = useState([]);
  const [selectedWebhooks, setSelectedWebhooks] = useState([]);

  const [isIntegrationContent, setIsIntegrationContent] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [oldContent, setOldContent] = useState({});
  const [apiStatus, setApiStatus] = useState({
    source: false,
    destination: false,
  });

  const getWebhooks = async () => {
    const res = await getWebhookRequest();
    if (res.responseCode === 200) setWebhooks(res.content);
  };

  const statusChangeWebhookHandler = async (status, changedWebhookID) => {
    const credentials = {
      webhook_id: changedWebhookID ? changedWebhookID : selectedWebhooks,
      action: status.toLowerCase(),
    };
    await postWebhookRequest(credentials);

    // setWebhooks((prev) => {
    //   prev.map((e) => {
    //     if (changedWebhookID && e.webhook_id === changedWebhookID)
    //       return { ...e, status: (status + "d").toUpperCase() };
    //     return e;
    //   });
    // });
    setWebhooks((prev) =>
      prev.map((e) => {
        if (
          (changedWebhookID && e.webhook_id === changedWebhookID) ||
          (!changedWebhookID && selectedWebhooks.includes(e.webhook_id))
        )
          return { ...e, status: (status + "d").toUpperCase() };
        return e;
      })
    );
    if (!changedWebhookID) setSelectedWebhooks([]);
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

  const selectWebhookHandler = (webhookID) => {
    if (selectedWebhooks.includes(webhookID))
      setSelectedWebhooks((prev) => prev.filter((e) => e !== webhookID));
    else setSelectedWebhooks((prev) => [...prev, webhookID]);
  };

  const integrationUpdateHandler = async (webhook) => {
    const res_source = await validateApiKey({
      app_name: webhook.value.source["app_name"].toLowerCase(),
      action: webhook.value.source["app_action"],
      api_key: webhook.value.source["api_key"],
    });
    const res_destination = await validateApiKey({
      app_name: webhook.value.destination["app_name"].toLowerCase(),
      action: webhook.value.destination["app_action"],
      api_key: webhook.value.destination["api_key"],
    });

    setOldContent((prev) => {
      return {
        ...webhook,
        app_datas: { source: res_source.content.content, destination: {} },
      };
    });

    setApiStatus({
      source: res_source.content.responseCode === 200,
      destination: res_destination.content.responseCode === 200,
    });
    setIsUpdate(true);
    setIsIntegrationContent(true);
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

  const templateSelectHandler = (permutation) => {
    setIsTemplate(true);

    const sourceSettings = {};
    for (const field in appSettingsInitial[permutation.source.name][
      permutation.source.trigger
    ]) {
      if (field.templateDefault)
        sourceSettings[field.selection] = field.templateDefault;
    }
    const destinationSettings = {};
    for (const field of appSettingsInitial[permutation.destination.name][
      permutation.destination.action
    ]) {
      if (field.templateDefault)
        destinationSettings[field.selection] = field.templateDefault;
    }

    setOldContent({
      value: {
        source: {
          app_name: permutation.source.name,
          app_action: permutation.source.trigger,
          settings: sourceSettings,
        },
        destination: {
          app_name: permutation.destination.name,
          app_action: permutation.destination.action,
          settings: destinationSettings,
        },
      },
    });
    setIsIntegrationContent(true);
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
          apps={APPS}
          appSettingsInitial={appSettingsInitial}
          onClose={closeHandler}
          onIntegrationSave={integrationSaveHandler}
          update={isUpdate}
          isTemplate={isTemplate}
          oldContent={oldContent}
          apiStatus={apiStatus}
        />
      ) : (
        <UserContent
          apps={APPS}
          onTemplateSelect={templateSelectHandler}
          onNewIntegration={setIsIntegrationContent}
          onIntegrationUpdate={integrationUpdateHandler}
          webhooks={webhooks}
          selectedWebhooks={selectedWebhooks}
          onStatusChangeWebhook={statusChangeWebhookHandler}
          onFavorite={favoriteWebhookHandler}
          onSelect={selectWebhookHandler}
        />
      )}
    </div>
  );
};

export default AppContainer;
