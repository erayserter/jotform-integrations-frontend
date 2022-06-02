import React, { useState, useRef, useEffect } from "react";

import classes from "./IntegrationWizard.module.css";

import IntegrationAppCard from "./IntegrationAppCard";
import ModalBox from "../../../UI/ModalBox";
import IntegrationAppSelector from "./Selector/IntegrationAppSelector";
import IntegrationSettings from "./Settings/IntegrationSettings";

const appSettingsInitial = {
  Jotform: {
    "Get Submission": [
      {
        label: "Choose Form",
        type: "Select",
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
      },
      {
        label: "File Upload Field",
        type: "Select",
        selection: "upload_fields",
        data: [],
      },
    ],
  },
};

const APPS = [
  {
    id: 1,
    name: "Jotform",
    img: "https://www.jotform.com/resources/assets/svg/jotform-icon-transparent.svg",
    triggers: ["Get Submission"],
    actions: [
      "Jotform action 1",
      "Jotform action 2",
      "Jotform action 3",
      "Jotform action 4",
      "Jotform action 5",
    ],
  },
  {
    id: 2,
    name: "Telegram",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
    triggers: [
      "Telegram trigger 1",
      "Telegram trigger 2",
      "Telegram trigger 3",
      "Telegram trigger 4",
      "Telegram trigger 5",
    ],
    actions: ["Send Message"],
  },
];

const createIntegration = async (credentials) => {
  return await fetch("https://me-serter.jotform.dev/intern-api/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

const IntegrationWizard = (props) => {
  const [appType, setAppType] = useState("source");
  const [settingsChoice, setSettingsChoice] = useState("source");

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isIntegrationChoice, setIsIntegrationChoice] = useState(false);
  const [isAuthenticationsValid, setIsAuthenticationsValid] = useState(false);
  const [isSettingsChoice, setIsSettingsChoice] = useState(false);

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

  useEffect(() => {}, []);

  const modalClickRef = useRef();

  const modalBoxHandler = (bool) => {
    setIsModelOpen(bool);
  };

  const integrationChoiceHandler = (bool, type) => {
    setAppType(type);
    setIsIntegrationChoice(bool);
  };

  const cards = {
    source: (
      <IntegrationAppCard
        apps={APPS}
        onClick={(bool, type) => {
          integrationChoiceHandler(bool, type);
          setIsModelOpen(true);
        }}
        datas={selectedDatas.source}
        type="source"
      />
    ),
    destination: (
      <IntegrationAppCard
        apps={APPS}
        onClick={(bool, type) => {
          integrationChoiceHandler(bool, type);
          setIsModelOpen(true);
        }}
        datas={selectedDatas.destination}
        type="destination"
      />
    ),
  };

  const switchHandler = (event) => {
    setSelectedDatas((prev) => {
      return {
        source: [prev.destination[0], "", prev.destination[2]],
        destination: [prev.source[0], "", prev.source[2]],
      };
    });
    setSelectedSettings({ source: {}, destination: {} });
    setIsAuthenticationsValid(false);
  };

  const authHandler = (datas, type, appDatas) => {
    setIsModelOpen(false);
    setIsIntegrationChoice(false);
    setSelectedDatas((prev) => {
      return { ...prev, [type.toLowerCase()]: datas };
    });
    setAppDatas((prev) => {
      return { ...prev, [type]: appDatas };
    });

    if (
      (selectedDatas["source"][1] !== null || type === "source") &&
      (selectedDatas["destination"][1] !== null || type === "destination")
    )
      setIsAuthenticationsValid(true);
  };

  const settingsHandler = (event) => {
    setIsIntegrationChoice(false);
    setIsSettingsChoice(true);
    setIsModelOpen(true);
  };

  const saveSettingsHandler = (values, type) => {
    setSelectedSettings((prev) => {
      return { ...prev, [type]: values };
    });
    if (settingsChoice === "source") {
      setSettingsChoice("destination");
    } else {
      const source_app = APPS.filter((e) => {
        return e.id === selectedDatas.source[0];
      })[0];
      const destination_app = APPS.filter((e) => {
        return e.id === selectedDatas.destination[0];
      })[0];

      const settings = {
        source: {},
        destination: {},
      };
      for (const setting in selectedSettings.source) {
        if (
          appSettingsInitial[source_app.name][selectedDatas.source[1]].filter(
            (e) => e.selection === setting
          )[0].type === "tagInput"
        ) {
          let temp = "";
          const settingText = selectedSettings.source[setting];
          let currIndex = 0;
          while (settingText.indexOf("[[", currIndex) != -1) {
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
          settings.source[setting] = temp;
        } else {
          settings.source[setting] = selectedSettings.source[setting];
        }
      }
      for (const setting in values) {
        if (
          appSettingsInitial[destination_app.name][
            selectedDatas.destination[1]
          ].filter((e) => e.selection === setting)[0].type === "tagInput"
        ) {
          let temp = "";
          const settingText = values[setting];
          let currIndex = 0;
          while (settingText.indexOf("[[", currIndex) != -1) {
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
            console.log(currIndex);
            console.log(temp);
          }
          temp += settingText.slice(currIndex);
          settings.destination[setting] = temp;
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
        action: "create",
      };

      const res = createIntegration(allData);

      props.onClose();
    }
  };

  return (
    <div className={classes["wizard"]}>
      <div className={classes["cards"]}>
        {cards.source}
        <div className={classes["switch-icon"]} onClick={switchHandler}>
          <img
            src="https://img.icons8.com/ios-glyphs/100/000000/refresh--v2.png"
            alt=""
          />
        </div>
        {cards.destination}

        {isModelOpen && (
          <ModalBox onModalBoxClose={modalBoxHandler} ref={modalClickRef}>
            {isIntegrationChoice && (
              <IntegrationAppSelector
                apps={APPS}
                onAuthenticate={authHandler}
                type={appType}
                datas={selectedDatas}
                appDatas={appDatas}
              />
            )}
            {isSettingsChoice && (
              <IntegrationSettings
                app={
                  APPS.filter((e) => {
                    return e.id === selectedDatas[settingsChoice][0];
                  })[0]
                }
                appSettingsInitial={appSettingsInitial}
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
      {isAuthenticationsValid && (
        <div className={classes["settingContainer"]}>
          <button
            className={classes["settingsButton"]}
            onClick={settingsHandler}
          >
            Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default IntegrationWizard;
