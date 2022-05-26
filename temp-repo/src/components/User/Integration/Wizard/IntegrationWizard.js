import React, { useState, useRef } from "react";

import classes from "./IntegrationWizard.module.css";

import IntegrationAppCard from "./IntegrationAppCard";
import ModalBox from "../../../UI/ModalBox";
import IntegrationAppSelector from "./Selector/IntegrationAppSelector";

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

const getForms = async (apiKey) => {
  return fetch(
    "https://b-ersoz.jotform.dev/intern-api/getForms?apiKey=" + apiKey
  ).then((data) => data.json());
};

const createIntegration = async (credentials) => {
  return await fetch("https://b-ersoz.jotform.dev/intern-api/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

const IntegrationWizard = (props) => {
  const [appType, setAppType] = useState("Source");

  const [isIntegrationChoice, setIsIntegrationChoice] = useState(false);
  const [isAuthenticationsValid, setIsAuthenticationsValid] = useState(false);

  const [selectedDatas, setSelectedDatas] = useState({
    source: [null, null, null],
    destination: [null, null, null],
  });
  const [selectedSettings, setSelectedSettings] = useState({
    Source: {},
    Destination: {},
  });

  const modalClickRef = useRef();

  const integrationChoiceHandler = (bool, type) => {
    setAppType(type);
    setIsIntegrationChoice(bool);
  };

  const cards = {
    source: (
      <IntegrationAppCard
        apps={APPS}
        onClick={integrationChoiceHandler}
        datas={selectedDatas.source}
        type="Source"
      />
    ),
    destination: (
      <IntegrationAppCard
        apps={APPS}
        onClick={integrationChoiceHandler}
        datas={selectedDatas.destination}
        type="Destination"
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
    setSelectedSettings({ Source: {}, Destination: {} });
  };

  const authHandler = (datas, type) => {
    if (type === "Source")
      setSelectedDatas((prev) => {
        return {
          source: datas,
          destination: prev.destination,
        };
      });
    else
      setSelectedDatas((prev) => {
        return {
          source: prev.source,
          destination: datas,
        };
      });
  };

  const saveHandler = (values, type) => {
    // console.log(values);
    setSelectedSettings((prev) => {
      return { ...prev, [type]: values };
    });

    for (const key in selectedSettings) {
      setIsAuthenticationsValid(true);
      if (
        Object.keys(selectedSettings[key]).length === 0 &&
        selectedSettings[key].constructor === Object &&
        key !== type
      ) {
        setIsAuthenticationsValid(false);
      }
    }
    setIsIntegrationChoice(false);
  };

  const integrateHandler = (event) => {
    const source_app = APPS.filter((e) => {
      return e.id === selectedDatas.source[0];
    })[0];
    const destination_app = APPS.filter((e) => {
      return e.id === selectedDatas.destination[0];
    })[0];

    const allData = {
      Source: {
        app_name: source_app.name,
        app_action: selectedDatas.source[1],
        settings: selectedSettings.Source,
      },
      Destination: {
        app_name: destination_app.name,
        app_action: selectedDatas.destination[1],
        settings: selectedSettings.Destination,
      },
    };

    const res = createIntegration(allData);

    props.onNewIntegration();
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

        {isIntegrationChoice && (
          <ModalBox
            onIntegrationChoice={integrationChoiceHandler}
            ref={modalClickRef}
          >
            <IntegrationAppSelector
              apps={APPS}
              onAuthenticate={authHandler}
              onSave={saveHandler}
              type={appType}
              datas={selectedDatas}
              settingsData={selectedSettings}
            />
          </ModalBox>
        )}
      </div>
      {isAuthenticationsValid && (
        <div className={classes["settingContainer"]}>
          <button
            className={classes["settingsButton"]}
            onClick={integrateHandler}
          >
            Integrate
          </button>
        </div>
      )}
    </div>
  );
};

export default IntegrationWizard;
