import React, { useState, useRef, useEffect } from "react";

import classes from "./IntegrationWizard.module.css";

import IntegrationAppCard from "./IntegrationAppCard";
import ModalBox from "../../../UI/ModalBox";
import IntegrationAppSelector from "./Selector/IntegrationAppSelector";
import IntegrationSettings from "./Settings/IntegrationSettings";

const IntegrationWizard = (props) => {
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
    source: [null, null, null],
    destination: [null, null, null],
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

        setSelectedDatas({
          source: [
            source_app.id,
            props.oldContent.value.source["app_action"],
            props.oldContent.value.source["api_key"],
          ],
          destination: [
            destination_app.id,
            props.oldContent.value.destination["app_action"],
            props.oldContent.value.destination["api_key"],
          ],
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
          source: [
            source_app.id,
            props.oldContent.value.source["app_action"],
            null,
          ],
          destination: [
            destination_app.id,
            props.oldContent.value.destination["app_action"],
            null,
          ],
        });
        setSelectedSettings({
          source: props.oldContent.value.source.settings,
          destination: props.oldContent.value.destination.settings,
        });
        integrationChoiceHandler(true, "source");
      }
    }
  }, [props.update, props.isTemplate]);

  const modalClickRef = useRef();

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
        source: [prev.destination[0], "", prev.destination[2]],
        destination: [prev.source[0], "", prev.source[2]],
      };
    });
    setSelectedSettings({ source: {}, destination: {} });
    setApiStatus({ source: false, destination: false });
  };

  const authHandler = (datas, type, appDatas) => {
    setIsModelOpen(false);
    setIsAppChoice(false);
    setSelectedDatas((prev) => {
      return { ...prev, [type.toLowerCase()]: datas };
    });
    setAppDatas((prev) => {
      return { ...prev, [type]: appDatas };
    });
    setApiStatus((prev) => {
      return { ...prev, [type]: true };
    });
    if (
      (selectedDatas.source[2] === null && type !== "source") ||
      (selectedDatas.destination[2] === null && type !== "destination")
    ) {
      if (selectedDatas.source[2] === null && type !== "source") {
        integrationChoiceHandler(true, "source");
      } else {
        integrationChoiceHandler(true, "destination");
      }
    }
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
        return e.id === selectedDatas.source[0];
      })[0];
      const destination_app = props.apps.filter((e) => {
        return e.id === selectedDatas.destination[0];
      })[0];

      const settings = {
        source: {},
        destination: {},
      };
      for (const setting in selectedSettings.source) {
        if (
          props.appSettingsInitial[source_app.name][
            selectedDatas.source[1]
          ].filter((e) => e.selection === setting)[0].type === "tagInput"
        ) {
          let temp = "";
          const settingText = selectedSettings.source[setting];
          let currIndex = 0;
          while (settingText.indexOf("[[", currIndex) !== -1) {
            temp += settingText.slice(
              currIndex,
              settingText.indexOf("[[", currIndex) + 2
            );
            const textJson = JSON.parse(
              settingText.slice(
                settingText.indexOf("[[", currIndex) + 2,
                settingText.indexOf("]]", currIndex)
              )
            );
            temp += textJson.id;
            temp += "]]";
            currIndex = settingText.indexOf("]]", currIndex) + 2;
          }
          temp += settingText.slice(currIndex);
          settings.source[setting] = temp.slice(0, temp.length - 1);
        } else {
          settings.source[setting] = selectedSettings.source[setting];
        }
      }
      for (const setting in values) {
        if (
          props.appSettingsInitial[destination_app.name][
            selectedDatas.destination[1]
          ].filter((e) => e.selection === setting)[0].type === "tagInput"
        ) {
          let temp = "";
          const settingText = values[setting];
          let currIndex = 0;
          while (settingText.indexOf("[[", currIndex) !== -1) {
            temp += settingText.slice(
              currIndex,
              settingText.indexOf("[[", currIndex) + 2
            );
            const textJson = JSON.parse(
              settingText.slice(
                settingText.indexOf("[[", currIndex) + 2,
                settingText.indexOf("]]", currIndex)
              )
            );
            temp += textJson.id;
            temp += "]]";
            currIndex = settingText.indexOf("]]", currIndex) + 2;
          }
          temp += settingText.slice(currIndex);
          settings.destination[setting] = temp.slice(0, temp.length - 1);
        } else {
          settings.destination[setting] = values[setting];
        }
      }

      const allData = {
        source: {
          app_name: source_app.name.toLowerCase(),
          app_action: selectedDatas.source[1],
          api_key: selectedDatas.source[2],
          settings: settings.source,
        },
        destination: {
          app_name: destination_app.name.toLowerCase(),
          app_action: selectedDatas.destination[1],
          api_key: selectedDatas.destination[2],
          settings: settings.destination,
        },
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

  return (
    <div className={classes["wizard"]}>
      <div className={classes["cards"]}>
        <IntegrationAppCard
          isValid={apiStatus.source}
          isUpdate={props.update}
          apps={props.apps}
          onClick={(bool, type) => {
            integrationChoiceHandler(bool, type);
          }}
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
          onClick={(bool, type) => {
            integrationChoiceHandler(bool, type);
          }}
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
        <ModalBox onModalBoxClose={modalBoxHandler} ref={modalClickRef}>
          {isAppChoice && (
            <IntegrationAppSelector
              apps={props.apps}
              onAuthenticate={authHandler}
              type={appType}
              datas={selectedDatas}
              appDatas={appDatas}
              isValid={apiStatus[appType]}
            />
          )}
          {isSettingsChoice && (
            <IntegrationSettings
              app={
                props.apps.filter((e) => {
                  return e.id === selectedDatas[settingsChoice][0];
                })[0]
              }
              appSettingsInitial={props.appSettingsInitial}
              onSettingsChange={settingsChangeHandler}
              onSave={saveSettingsHandler}
              appAction={selectedDatas[settingsChoice][1]}
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
