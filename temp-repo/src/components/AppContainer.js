import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Navigate } from "react-router-dom";

import Navbar from "./Navbar/Navbar";
import UserContent from "./User/Content/UserContent";
import IntegrationContent from "./User/Integration/IntegrationContent";

import { setPrefills } from "../store/prefills";
import { setWebhooks, setSelectedWebhooks } from "../store/webhooks";
import {
  setIsIntegrationContent,
  setIsUpdate,
  setIsTemplate,
  setCurrentContent,
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

const getPrefillRequest = async () => {
  return fetch(
    "https://" +
      configurations.DEV_RDS_NAME +
      ".jotform.dev/intern-api/getAllPrefills"
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

const AppContainer = (props) => {
  const dispatch = useDispatch();
  const webhooks = useSelector((state) => state.webhooks.webhooks);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const selectedWebhooks = useSelector(
    (state) => state.webhooks.selectedWebhooks
  );
  const [webhooksLoading, setWebhooksLoading] = useState(true);
  const [prefillsLoading, setPrefillsLoading] = useState(false);

  const apps = useSelector((state) => state.apps.apps);

  const appSelections = useSelector((state) => state.inputs.appSelections);

  const isIntegrationContent = useSelector(
    (state) => state.ui.isIntegrationContent
  );

  const getWebhooks = async () => {
    const res = await getWebhookRequest();
    if (res.responseCode === 200) {
      dispatch(setWebhooks({ webhooks: res.content }));
      setWebhooksLoading(false);
    }
  };

  const getPrefills = async () => {
    const res = await getPrefillRequest();
    if (res.responseCode === 200) {
      dispatch(
        setPrefills({
          prefills: res.content.map((prefill) => ({
            id: prefill.id,
            url: prefill.prefill_url,
            title: prefill.prefill_name,
          })),
        })
      );
      setPrefillsLoading(false);
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

    const clientData = destination_app.prepareDataClientSide(webhook.value);

    const info = {
      source: { res: null, status: false, content: null },
      destination: { res: null, status: false, content: null },
    };

    if (source_app.isOauth) {
      info.source.res = await source_app.authenticate(
        clientData.source.app_name
      );
      const user = info.source.res.content.find(
        (e) => e.auth_user_id === clientData.source.auth_user_id
      );
      if (user) info.source.status = true;
      info.source.content = user;
    } else {
      info.source.res = await source_app.authenticate({
        app_name: clientData.source["app_name"].toLowerCase(),
        action: clientData.source["app_action"],
        api_key: clientData.source["api_key"],
      });
      info.source.status = info.source.res.responseCode === 200;
      info.source.content = info.source.res.content;
    }
    if (destination_app.isOauth) {
      info.destination.res = await destination_app.authenticate(
        clientData.destination.app_name
      );
      const user = info.destination.res.content.find(
        (e) => e.auth_user_id === clientData.destination.auth_user_id
      );
      if (user) info.destination.status = true;
      info.destination.content = user;
    } else {
      info.destination.res = await destination_app.authenticate({
        app_name: clientData.destination["app_name"].toLowerCase(),
        action: clientData.destination["app_action"],
        api_key: clientData.destination["api_key"],
      });
      info.destination.status = info.destination.res.responseCode === 200;
      info.destination.content = info.destination.res.content;
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
              (e) => e.name === clientData.source.app_action
            ),
            key: clientData.source.api_key,
            auth_id: clientData.source.auth_user_id,
          },
          destination: {
            app: destination_app,
            action: destination_app.actions.find(
              (e) => e.name === clientData.destination.app_action
            ),
            key: clientData.destination.api_key,
            auth_id: clientData.destination.auth_user_id,
          },
        },
      })
    );

    dispatch(
      setSettingsSelections({
        settingsSelections: {
          source: clientData.source.settings,
          destination: clientData.destination.settings,
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
    dispatch(setCurrentContent({ currentContent: "choice" }));
    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          name: "Integration",
          source: {
            app: undefined,
            action: undefined,
            key: undefined,
            auth_id: undefined,
          },
          destination: {
            app: undefined,
            action: undefined,
            key: undefined,
            auth_id: undefined,
          },
          prefill: {
            app: undefined,
            action: undefined,
            key: undefined,
            auth_id: undefined,
          },
        },
      })
    );
    dispatch(
      setSettingsSelections({
        settingsSelections: { source: {}, destination: {}, prefill: {} },
      })
    );
    dispatch(
      setApiInfo({
        apiInfo: {
          source: false,
          destination: false,
          prefill: false,
        },
      })
    );
  };

  const integrationSaveHandler = async (data, isUpdate) => {
    const backendData =
      apps[data.destination.app_name].prepareDataServerSide(data);
    const res = await postWebhookRequest(backendData);
    const newWebhooks = isUpdate
      ? webhooks.map((webhook) => {
          if (webhook.webhook_id === res.content.webhookId)
            return {
              ...webhook,
              webhook_name: backendData.webhook_name,
              value: {
                source: backendData.source,
                destination: backendData.destination,
              },
            };
          return webhook;
        })
      : [
          ...webhooks,
          {
            webhook_id: res.content.webhookId,
            webhook_name: backendData.webhook_name,
            value: {
              source: backendData.source,
              destination: backendData.destination,
            },
            status: "ENABLED",
            is_favorite: "0",
          },
        ];

    dispatch(setWebhooks({ webhooks: newWebhooks }));
    closeHandler();
  };

  useEffect(() => {
    if (isLoggedIn) {
      getWebhooks();
      getPrefills();
    }
  }, []);

  if (!isLoggedIn)
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
          prefillsLoading={prefillsLoading}
          onIntegrationSave={integrationSaveHandler}
        />
      ) : (
        <UserContent
          webhooksLoading={webhooksLoading}
          prefillsLoading={prefillsLoading}
          onIntegrationUpdate={integrationUpdateHandler}
          onStatusChangeWebhook={statusChangeWebhookHandler}
          onFavorite={favoriteWebhookHandler}
          onSelect={selectWebhookHandler}
          onClose={closeHandler}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default AppContainer;
