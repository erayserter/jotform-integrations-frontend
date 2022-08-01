import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

import Navbar from "./Navbar/Navbar";
import UserContent from "./User/Content/UserContent";
import IntegrationContent from "./User/Integration/IntegrationContent";

import { setWebhooks, setSelectedWebhooks } from "../store/webhooks";
import {
  setIsIntegrationContent,
  setIsUpdate,
  setIsTemplate,
} from "../store/ui";
import { setApiInfo, setAppInfo } from "../store/infos";
import { setAppSelections, setSettingsSelections } from "../store/inputs";

import { useDispatch, useSelector } from "react-redux";

import configurations from "../config/index";

const getWebhookRequest = async () => {
  return fetch(
    "https://" +
      configurations.DEV_RDS_NAME +
      ".jotform.dev/intern-api/getAllWebhooks"
  ).then((res) => res.json());
};

const postWebhookRequest = async (credentials) => {
  return await fetch(
    "https://" +
      configurations.DEV_RDS_NAME +
      ".jotform.dev/intern-api/webhook",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  ).then((data) => data.json());
};

async function validateApiKey(credentials) {
  return fetch(
    "https://" +
      configurations.DEV_RDS_NAME +
      ".jotform.dev/intern-api/validateApiKey",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  ).then((data) => data.json());
}

async function getAllUserData(appName) {
  return fetch(
    "https://" +
      configurations.DEV_RDS_NAME +
      ".jotform.dev/intern-api/getAllUserData?app_name=" +
      appName
  ).then((res) => res.json());
}

const AppContainer = (props) => {
  const dispatch = useDispatch();
  const webhooks = useSelector((state) => state.webhooks.webhooks);
  const selectedWebhooks = useSelector(
    (state) => state.webhooks.selectedWebhooks
  );
  const apps = useSelector((state) => state.apps.apps);

  const appSelections = useSelector((state) => state.inputs.appSelections);

  const isIntegrationContent = useSelector(
    (state) => state.ui.isIntegrationContent
  );

  const getWebhooks = async () => {
    const res = await getWebhookRequest();
    if (res.responseCode === 200) {
      dispatch(setWebhooks({ webhooks: res.content }));
    }
  };

  const statusChangeWebhookHandler = async (status, changedWebhookID) => {
    const credentials = {
      webhook_id: changedWebhookID ? changedWebhookID : selectedWebhooks,
      action: status.toLowerCase(),
    };
    await postWebhookRequest(credentials);
    const newWebhooks = webhooks.map((webhook) => {
      if (
        (changedWebhookID && webhook.webhook_id === changedWebhookID) ||
        (!changedWebhookID && selectedWebhooks.includes(webhook.webhook_id))
      )
        return { ...webhook, status: (status + "d").toUpperCase() };
      return webhook;
    });
    dispatch(setWebhooks({ webhooks: newWebhooks }));
    if (!changedWebhookID)
      dispatch(setSelectedWebhooks({ selectedWebhooks: [] }));
  };

  const favoriteWebhookHandler = async (webhook_id, bool) => {
    const credentials = {
      webhook_id: webhook_id,
      is_favorite: bool,
      action: "favorite",
    };
    await postWebhookRequest(credentials);

    const newWebhooks = webhooks.map((webhook) => {
      if (webhook.webhook_id === webhook_id) {
        return { ...webhook, is_favorite: bool.toString() };
      }
      return webhook;
    });

    dispatch(setWebhooks({ webhooks: newWebhooks }));
  };

  const selectWebhookHandler = (webhookID) => {
    if (selectedWebhooks.includes(webhookID))
      dispatch(
        setSelectedWebhooks({
          selectedWebhooks: selectedWebhooks.filter((e) => e !== webhookID),
        })
      );
    else
      dispatch(
        setSelectedWebhooks({
          selectedWebhooks: [...selectedWebhooks, webhookID],
        })
      );
  };

  const integrationUpdateHandler = async (webhook) => {
    const source_app = apps[webhook.value.source.app_name];
    const destination_app = apps[webhook.value.destination.app_name];

    const info = {
      source: { res: null, status: false, content: null },
      destination: { res: null, status: false, content: null },
    };

    if (source_app.isOauth) {
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
    if (destination_app.isOauth) {
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

    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          webhookId: webhook.webhook_id,
          name: webhook.webhook_name,
          source: {
            app: source_app,
            action: source_app.triggers.find(
              (e) => e.name === webhook.value.source.app_action
            ),
            key: webhook.value.source.api_key,
            auth_id: webhook.value.source.auth_user_id,
          },
          destination: {
            app: destination_app,
            action: destination_app.actions.find(
              (e) => e.name === webhook.value.destination.app_action
            ),
            key: webhook.value.destination.api_key,
            auth_id: webhook.value.destination.auth_user_id,
          },
        },
      })
    );

    dispatch(
      setSettingsSelections({
        settingsSelections: {
          source: webhook.value.source.settings,
          destination: webhook.value.destination.settings,
        },
      })
    );

    dispatch(
      setAppInfo({
        appInfo: {
          source: info.source.content,
          destination: info.destination.content,
        },
      })
    );

    dispatch(
      setApiInfo({
        apiInfo: {
          source: info.source.status,
          destination: info.destination.status,
        },
      })
    );

    dispatch(setIsUpdate({ isUpdate: true }));
    dispatch(setIsIntegrationContent({ isIntegrationContent: true }));
  };

  const closeHandler = () => {
    dispatch(setIsIntegrationContent({ isIntegrationContent: false }));
    dispatch(setIsUpdate({ isUpdate: false }));
    dispatch(setIsTemplate({ isTemplate: false }));
    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          name: "Integration",
          source: {
            app: null,
            action: null,
            key: null,
            auth_id: null,
          },
          destination: {
            app: null,
            action: null,
            key: null,
            auth_id: null,
          },
        },
      })
    );
    dispatch(
      setSettingsSelections({
        settingsSelections: { source: {}, destination: {} },
      })
    );
    dispatch(
      setApiInfo({
        apiInfo: {
          source: false,
          destination: false,
        },
      })
    );
  };

  const integrationSaveHandler = async (data, isUpdate) => {
    data = apps[data.destination.app_name].prepareData(data);
    const res = await postWebhookRequest(data);
    const newWebhooks = isUpdate
      ? webhooks.map((webhook) => {
          if (webhook.webhook_id === res.content.webhookId)
            return {
              ...webhook,
              webhook_name: data.webhook_name,
              value: { source: data.source, destination: data.destination },
            };
          return webhook;
        })
      : [
          ...webhooks,
          {
            webhook_id: res.content.webhookId,
            webhook_name: data.webhook_name,
            value: { source: data.source, destination: data.destination },
            status: "ENABLED",
            is_favorite: "0",
          },
        ];

    dispatch(setWebhooks({ webhooks: newWebhooks }));
    closeHandler();
  };

  useEffect(() => {
    if (props.isLoggedIn) getWebhooks();
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
    <div className="min-h-100vh flex flex-col bg-white relative items-stretch color-black font-circular overflow-x-hidden">
      <Navbar />
      {isIntegrationContent ? (
        <IntegrationContent
          onClose={closeHandler}
          onIntegrationSave={integrationSaveHandler}
        />
      ) : (
        <UserContent
          onIntegrationUpdate={integrationUpdateHandler}
          onStatusChangeWebhook={statusChangeWebhookHandler}
          onFavorite={favoriteWebhookHandler}
          onSelect={selectWebhookHandler}
        />
      )}
    </div>
  );
};

export default AppContainer;
