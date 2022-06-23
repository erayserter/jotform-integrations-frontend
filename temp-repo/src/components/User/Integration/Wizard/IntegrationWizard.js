import React, { useState, useRef, useEffect } from "react";

import classes from "./IntegrationWizard.module.css";

import IntegrationAppCard from "./IntegrationAppCard";
import ModalBox from "../../../UI/ModalBox";
import IntegrationAppSelector from "./Selector/IntegrationAppSelector";
import IntegrationSettings from "./Settings/IntegrationSettings";
import InlineEdit from "../../../UI/InlineEdit";

const IntegrationWizard = (props) => {
  const [webhookName, setWebhookName] = useState("Integration");

  const [appType, setAppType] = useState("source");
  const [settingsChoice, setSettingsChoice] = useState("source");

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAppChoice, setIsAppChoice] = useState(false);
  const [isSettingsChoice, setIsSettingsChoice] = useState(false);

  const [apiStatus, setApiStatus] = useState({
    source: false,
    destination: false,
  });
  const [appDatas, setAppDatas] = useState({
    source: {},
    destination: {},
  });
  const [selectedDatas, setSelectedDatas] = useState({
    source: { id: null, action: null, key: null, auth_id: null },
    destination: { id: null, action: null, key: null, auth_id: null },
  });
  const [selectedSettings, setSelectedSettings] = useState({
    source: {},
    destination: {},
  });

  const apiStatusValid = apiStatus.source && apiStatus.destination;

  useEffect(() => {
    if (Object.keys(props.oldContent).length !== 0) {
      const source_app = props.apps.filter(
        (e) =>
          e.name.toLowerCase() ===
          props.oldContent.value.source["app_name"].toLowerCase()
      )[0];
      const destination_app = props.apps.filter(
        (e) =>
          e.name.toLowerCase() ===
          props.oldContent.value.destination["app_name"].toLowerCase()
      )[0];
      if (props.update) {
        const allAuthsValid =
          props.apiStatus.source && props.apiStatus.destination;

        setApiStatus(props.apiStatus);

        if (allAuthsValid) {
          setIsModelOpen(true);
          setIsSettingsChoice(true);
        }

        setWebhookName(props.oldContent.webhook_name);

        setSelectedDatas({
          source: {
            id: source_app.id,
            action: props.oldContent.value.source["app_action"],
            key: props.oldContent.value.source["api_key"],
            auth_id: props.oldContent.value.source.auth_user_id,
          },
          destination: {
            id: destination_app.id,
            action: props.oldContent.value.destination["app_action"],
            key: props.oldContent.value.destination["api_key"],
            auth_id: props.oldContent.value.destination.auth_user_id,
          },
        });
        setSelectedSettings({
          source: props.apiStatus.source
            ? props.oldContent.value.source.settings
            : {},
          destination: props.apiStatus.destination
            ? props.oldContent.value.destination.settings
            : {},
        });

        setAppDatas({
          source: props.apiStatus.source
            ? props.oldContent.app_datas.source
            : {},
          destination: props.apiStatus.destination
            ? props.oldContent.app_datas.destination
            : {},
        });
      } else if (props.isTemplate) {
        setSelectedDatas({
          source: {
            id: source_app.id,
            action: props.oldContent.value.source["app_action"],
            key: null,
            auth_id: null,
          },
          destination: {
            id: destination_app.id,
            action: props.oldContent.value.destination["app_action"],
            key: null,
            auth_id: null,
          },
        });
        setSelectedSettings({
          source: props.oldContent.value.source.settings,
          destination: props.oldContent.value.destination.settings,
        });
        integrationChoiceHandler(true, "source");
      }
    }
  }, [props.update, props.isTemplate]);

  const modalBoxHandler = (bool) => {
    setIsModelOpen(bool);
    if (!bool) {
      setIsAppChoice(false);
      setIsSettingsChoice(false);
    }
  };

  const integrationChoiceHandler = (bool, type) => {
    setAppType(type);
    setIsAppChoice(bool);
    setIsModelOpen(true);
  };

  const switchHandler = (event) => {
    setSelectedDatas((prev) => {
      return {
        source: {
          id: prev.destination.id,
          action: "",
          key: prev.destination.key,
        },
        destination: { id: prev.source.id, action: "", key: prev.source.key },
      };
    });
    setSelectedSettings({ source: {}, destination: {} });
  };

  const authHandler = (datas, type, appDatas) => {
    const valid = { ...apiStatus, [type]: true };
    setIsModelOpen(false);
    setIsAppChoice(false);
    setSelectedDatas((prev) => {
      return { ...prev, [type.toLowerCase()]: datas };
    });
    setAppDatas((prev) => {
      return { ...prev, [type]: appDatas };
    });
    setApiStatus(valid);
    if (!valid.source) integrationChoiceHandler(true, "source");
    else if (!valid.destination) integrationChoiceHandler(true, "destination");
  };

  const settingsHandler = (event) => {
    setIsAppChoice(false);
    setIsSettingsChoice(true);
    setIsModelOpen(true);
  };

  const settingsChangeHandler = (values, type) => {
    setSelectedSettings((prev) => {
      return { ...prev, [type]: values };
    });
  };

  const saveSettingsHandler = (values, type) => {
    if (settingsChoice === "source") {
      setSettingsChoice("destination");
    } else {
      const source_app = props.apps.filter((e) => {
        return e.id === selectedDatas.source.id;
      })[0];
      const destination_app = props.apps.filter((e) => {
        return e.id === selectedDatas.destination.id;
      })[0];

      const allData = {
        source: {
          app_name: source_app.name,
          app_action: selectedDatas.source.action,
          api_key: selectedDatas.source.key,
          auth_user_id: selectedDatas.source.auth_id,
          settings: selectedSettings.source,
        },
        destination: {
          app_name: destination_app.name,
          app_action: selectedDatas.destination.action,
          api_key: selectedDatas.destination.key,
          auth_user_id: selectedDatas.destination.auth_id,
          settings: selectedSettings.destination,
        },
        webhook_name: webhookName,
      };

      if (props.update) {
        allData.action = "update";
        allData["webhook_id"] = props.oldContent["webhook_id"];
      } else {
        allData.action = "create";
      }

      props.onIntegrationSave(allData, props.update);
    }
  };

  const typeChangeHandler = (type) => {
    setAppType(type);
  };

  return (
    <div className={classes["wizard"]}>
      <div className={classes["settingsInlineEdit"]}>
        <InlineEdit
          value={webhookName}
          setValue={setWebhookName}
          style={{ margin: "0px auto 0px auto" }}
        />
      </div>
      <h2 className={classes["wizard__subheading"]}>
        Select applications to easly create an integration between them.
      </h2>
      <div className={classes["cards"]}>
        <IntegrationAppCard
          isValid={apiStatus.source}
          isUpdate={props.update}
          apps={props.apps}
          onClick={(data) => {
            integrationChoiceHandler(true, data.type);
          }}
          text="Source"
          datas={selectedDatas.source}
          type="source"
        />
        <div className={classes["switch-icon"]} onClick={switchHandler}>
          <img
            src="https://img.icons8.com/ios-glyphs/100/000000/refresh--v2.png"
            alt=""
          />
        </div>
        <IntegrationAppCard
          isValid={apiStatus.destination}
          isUpdate={props.update}
          apps={props.apps}
          onClick={(data) => {
            integrationChoiceHandler(true, data.type);
          }}
          text="Destination"
          datas={selectedDatas.destination}
          type="destination"
        />
      </div>
      {props.update && !apiStatusValid && (
        <span className={classes["wizard--invalid-auth"]}>
          Authentication is required!
        </span>
      )}
      {apiStatusValid && (
        <div className={classes["settingContainer"]}>
          <button
            className={classes["settingsButton"]}
            onClick={settingsHandler}
          >
            Settings
          </button>
        </div>
      )}

      {isModelOpen && (
        <ModalBox onModalBoxClose={modalBoxHandler}>
          {isAppChoice && (
            <IntegrationAppSelector
              apps={props.apps}
              onAuthenticate={authHandler}
              type={appType}
              onTypeChange={typeChangeHandler}
              datas={selectedDatas}
              appDatas={appDatas}
              isValid={apiStatus[appType]}
            />
          )}
          {isSettingsChoice && (
            <IntegrationSettings
              apps={props.apps}
              appSettingsInitial={props.appSettingsInitial}
              onSettingsChange={settingsChangeHandler}
              onSave={saveSettingsHandler}
              onPreviousModal={setSettingsChoice}
              datas={selectedDatas}
              appAction={selectedDatas[settingsChoice].action}
              type={settingsChoice}
              settingsData={selectedSettings}
              appDatas={appDatas}
            />
          )}
        </ModalBox>
      )}
    </div>
  );
};

export default IntegrationWizard;
