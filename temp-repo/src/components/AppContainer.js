import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import Navbar from "./Navbar/Navbar";
import UserContent from "./User/Content/UserContent";
import IntegrationContent from "./User/Integration/IntegrationContent";

const APPS = [
  {
    id: 1,
    name: "Jotform",
    img: "https://www.jotform.com/resources/assets/svg/jotform-icon-transparent.svg",
    triggers: ["Get Submission"],
    actions: [],
    oauth: false,
  },
  {
    id: 2,
    name: "Telegram",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
    triggers: [],
    actions: ["Send Message", "Send Attachments"],
    oauth: false,
  },
  {
    id: 3,
    name: "ClickUp",
    img: "https://files.jotform.com/jotformapps/cde74cfb4f0ca88ebc50767e1e211553.png",
    triggers: [],
    actions: ["Create Task", "Create Subtask", "Create Comment"],
    oauth: true,
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
  ClickUp: {
    "Create Task": [
      {
        label: "Choose a Workspace",
        type: "Select",
        isMulti: false,
        selection: "workspace",
        data: [],
      },
      {
        label: "Choose a Space",
        type: "Select",
        isMulti: false,
        selection: "space",
        data: [],
      },
      {
        label: "Choose a Folder",
        type: "Select",
        isMulti: false,
        selection: "folder",
        data: [],
      },
      {
        label: "Choose a List",
        type: "Select",
        isMulti: false,
        selection: "list_id",
        data: [],
      },
      {
        label: "Match Your Fields",
        type: "matchFields",
        selection: "match_fields",
        data: {
          source: [],
          destination: [
            { value: "name", label: "Name" },
            { value: "description", label: "Description" },
            { value: "priority", label: "Priority" },
            { value: "status", label: "Status" },
          ],
          predefined: {
            priority: [
              { value: "urgent", label: "Urgent" },
              { value: "high", label: "High" },
              { value: "normal", label: "Normal" },
              { value: "low", label: "Low" },
            ],
            status: [
              { value: "todo", label: "TO DO" },
              { value: "complete", label: "COMPLETE" },
            ],
          },
        },
      },
    ],
    "Create Subtask": [
      {
        label: "Choose a Workspace",
        type: "Select",
        isMulti: false,
        selection: "workspace",
        data: [],
      },
      {
        label: "Choose a Space",
        type: "Select",
        isMulti: false,
        selection: "space",
        data: [],
      },
      {
        label: "Choose a Folder",
        type: "Select",
        isMulti: false,
        selection: "folder",
        data: [],
      },
      {
        label: "Choose a List",
        type: "Select",
        isMulti: false,
        selection: "list_id",
        data: [],
      },
      {
        label: "Choose a Task",
        type: "Select",
        isMulti: false,
        selection: "task",
        data: [],
      },
      {
        label: "Match Your Fields",
        type: "matchFields",
        selection: "match_fields",
        data: {
          source: [],
          destination: [
            { value: "name", label: "Name" },
            { value: "description", label: "Description" },
            { value: "priority", label: "Priority" },
            { value: "status", label: "Status" },
          ],
          predefined: {
            priority: [
              { value: "urgent", label: "Urgent" },
              { value: "high", label: "High" },
              { value: "normal", label: "Normal" },
              { value: "low", label: "Low" },
            ],
            status: [
              { value: "todo", label: "TO DO" },
              { value: "complete", label: "COMPLETE" },
            ],
          },
        },
      },
    ],
    "Create Comment": [
      {
        label: "Choose a Workspace",
        type: "Select",
        isMulti: false,
        selection: "workspace",
        data: [],
      },
      {
        label: "Choose a Space",
        type: "Select",
        isMulti: false,
        selection: "space",
        data: [],
      },
      {
        label: "Choose a Folder",
        type: "Select",
        isMulti: false,
        selection: "folder",
        data: [],
      },
      {
        label: "Choose a List",
        type: "Select",
        isMulti: false,
        selection: "list_id",
        data: [],
      },
      {
        label: "Choose a Task",
        type: "Select",
        isMulti: false,
        selection: "task",
        data: [],
      },
      {
        label: "Enter a Comment",
        type: "tagInput",
        selection: "comment",
        whitelist: [],
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

async function getAllUserData(appName) {
  return fetch(
    "https://me-serter.jotform.dev/intern-api/getAllUserData?app_name=" +
      appName
  ).then((res) => res.json());
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

  const [appOptions, setAppOptions] = useState({
    Jotform: {},
    Telegram: {},
    ClickUp: {},
  });

  const optionChangeHandler = (appName, options) => {
    setAppOptions((prev) => {
      return { ...prev, [appName]: options };
    });
  };

  const getWebhooks = async () => {
    const res = await getWebhookRequest();
    if (res.responseCode === 200) {
      setWebhooks(res.content);
    }
  };

  const statusChangeWebhookHandler = async (status, changedWebhookID) => {
    const credentials = {
      webhook_id: changedWebhookID ? changedWebhookID : selectedWebhooks,
      action: status.toLowerCase(),
    };
    await postWebhookRequest(credentials);

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
    const source_app = APPS.find(
      (e) =>
        e.name.toLowerCase() === webhook.value.source.app_name.toLowerCase()
    );
    const destination_app = APPS.find(
      (e) =>
        e.name.toLowerCase() ===
        webhook.value.destination.app_name.toLowerCase()
    );

    const info = {
      source: { res: null, status: false, content: null },
      destination: { res: null, status: false, content: null },
    };

    if (source_app.oauth) {
      info.source.res = await getAllUserData(webhook.value.source.app_name);
      const user = info.source.res.content.find(
        (e) => e.auth_user_id === webhook.value.source.auth_user_id
      );
      if (user) info.source.status = true;
      info.source.content = user;
    } else {
      info.source.res = await validateApiKey({
        app_name: webhook.value.source["app_name"].toLowerCase(),
        action: webhook.value.source["app_action"],
        api_key: webhook.value.source["api_key"],
      });
      info.source.status = info.source.res.content.responseCode === 200;
      info.source.content = info.source.res.content.content;
    }
    if (destination_app.oauth) {
      info.destination.res = await getAllUserData(
        webhook.value.destination.app_name
      );
      const user = info.destination.res.content.find(
        (e) => e.auth_user_id === webhook.value.destination.auth_user_id
      );
      if (user) info.destination.status = true;
      info.destination.content = user;
    } else {
      info.destination.res = await validateApiKey({
        app_name: webhook.value.destination["app_name"].toLowerCase(),
        action: webhook.value.destination["app_action"],
        api_key: webhook.value.destination["api_key"],
      });
      info.destination.status =
        info.destination.res.content.responseCode === 200;
      info.destination.content = info.destination.res.content.content;
    }

    setOldContent((prev) => {
      return {
        ...webhook,
        app_datas: {
          source: info.source.content,
          destination: info.destination.content,
        },
      };
    });

    setApiStatus({
      source: info.source.status,
      destination: info.destination.status,
    });
    setIsUpdate(true);
    setIsIntegrationContent(true);
  };

  const closeHandler = () => {
    setIsIntegrationContent(false);
    setIsUpdate(false);
    setIsTemplate(false);
    setOldContent({});
  };

  const integrationSaveHandler = async (data, isUpdate) => {
    const res = await postWebhookRequest(data);
    setWebhooks((prev) => {
      if (isUpdate)
        return prev.map((webhook) => {
          if (webhook.webhook_id === res.content.webhookId)
            return {
              ...webhook,
              webhook_name: data.webhook_name,
              value: { source: data.source, destination: data.destination },
            };
          return webhook;
        });

      return [
        ...prev,
        {
          webhook_id: res.content.webhookId,
          webhook_name: data.webhook_name,
          value: { source: data.source, destination: data.destination },
          status: "ENABLED",
          is_favorite: "0",
        },
      ];
    });

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
    <div className="flex flex-col bg-white relative items-stretch color-black font-circular overflow-x-hidden">
      <Navbar />
      {isIntegrationContent ? (
        <IntegrationContent
          apps={APPS}
          appSettingsInitial={appSettingsInitial}
          appOptions={appOptions}
          onOptionChange={optionChangeHandler}
          onClose={closeHandler}
          onIntegrationSave={integrationSaveHandler}
          isUpdate={isUpdate}
          isTemplate={isTemplate}
          onTemplateSelect={templateSelectHandler}
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
