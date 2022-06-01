import React, { useState, useRef } from "react";

import classes from "./IntegrationWizard.module.css";

import IntegrationAppCard from "./IntegrationAppCard";
import ModalBox from "../../../UI/ModalBox";
import IntegrationAppSelector from "./Selector/IntegrationAppSelector";
import IntegrationSettings from "./Settings/IntegrationSettings";

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

      const allData = {
        source: {
          app_name: source_app.name.toLowerCase(),
          app_action: selectedDatas.source[1],
          api_key: selectedDatas.source[2],
          settings: selectedSettings.source,
        },
        destination: {
          app_name: destination_app.name.toLowerCase(),
          app_action: selectedDatas.destination[1],
          api_key: selectedDatas.destination[2],
          settings: selectedSettings.destination,
        },
        action: "create",
      };

      const res = createIntegration(allData);

      props.onNewIntegration(false);
    }
  };

  // const integrateHandler = (event) => {
  //   const source_app = APPS.filter((e) => {
  //     return e.id === selectedDatas.source[0];
  //   })[0];
  //   const destination_app = APPS.filter((e) => {
  //     return e.id === selectedDatas.destination[0];
  //   })[0];

  //   const allData = {
  //     source: {
  //       app_name: source_app.name.toLowerCase(),
  //       app_action: selectedDatas.source[1],
  //       api_key: selectedDatas.source[2],
  //       settings: selectedSettings.source,
  //     },
  //     destination: {
  //       app_name: destination_app.name.toLowerCase(),
  //       app_action: selectedDatas.destination[1],
  //       api_key: selectedDatas.destination[2],
  //       settings: selectedSettings.destination,
  //     },
  //     action: "create",
  //   };

  //   const res = createIntegration(allData);

  //   props.onNewIntegration();
  // };

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
