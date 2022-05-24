import React, { useState, useRef } from "react";

import classes from "./IntegrationWizard.module.css";

import IntegrationAppCard from "./IntegrationAppCard";
import ModalBox from "../../../UI/ModalBox";
import IntegrationAppSelector from "./Selector/IntegrationAppSelector";

const APPS = [
  {
    id: 1,
    name: "Jotform",
    img: "https://cdn.jotfor.ms/assets/img/logo2021/jotform-logo.svg",
    triggers: ["Get Submission"],
    actions: [
      "whatsapp action 1",
      "whatsapp action 2",
      "whatsapp action 3",
      "whatsapp action 4",
      "whatsapp action 5",
    ],
  },
  {
    id: 2,
    name: "Telegram",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
    triggers: [
      "tele trigger 1",
      "tele trriger 2",
      "tele trriger 3",
      "tele trriger 4",
      "tele trriger 5",
    ],
    actions: [
      "tele action 1",
      "tele action 2",
      "tele action 3",
      "tele action 4",
      "tele action 5",
    ],
  },
];

const IntegrationWizard = (props) => {
  const [appType, setAppType] = useState("Source");

  const [isIntegrationChoice, setIsIntegrationChoice] = useState(false);
  const [isAuthenticationsValid, setIsAuthenticationsValid] = useState(false);

  const [selectedDatas, setSelectedDatas] = useState({
    source: [null, null, null],
    destination: [null, null, null],
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
    setIsIntegrationChoice(false);

    console.log(datas);

    setIsAuthenticationsValid(true);
    for (const [index, [key, value]] of Object.entries(
      Object.entries(selectedDatas)
    )) {
      if (value[1] == null && key != type.toLowerCase())
        setIsAuthenticationsValid(false);
    }
  };

  const settingsHandler = (e) => {};

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
              type={appType}
              datas={selectedDatas}
            />
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
