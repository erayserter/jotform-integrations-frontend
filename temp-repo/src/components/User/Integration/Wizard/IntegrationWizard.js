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
        isMulti: true,
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
    actions: ["Send Message", "Send Attachments"],
  },
];

async function validateApiKey(credentials) {
  return fetch("https://me-serter.jotform.dev/intern-api/validateApiKey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

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
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (props.update) {
      const source_app = APPS.filter(
        (e) =>
          e.name.toLowerCase() === props.oldContent.value.source["app_name"]
      )[0];
      const destination_app = APPS.filter(
        (e) =>
          e.name.toLowerCase() ===
          props.oldContent.value.destination["app_name"]
      )[0];
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
        source: props.oldContent.value.source.settings,
        destination: props.oldContent.value.destination.settings,
      });
      setIsLoading(true);

      const pullDatas = async () => {
        const res_source = await validateApiKey({
          app_name: props.oldContent.value.source["app_name"].toLowerCase(),
          action: props.oldContent.value.source["app_action"],
          api_key: props.oldContent.value.source["api_key"],
        });
        // const res_destination = await validateApiKey({
        //   app_name:
        //     props.oldContent.value.destination["app_name"].toLowerCase(),
        //   action: props.oldContent.value.destination["app_action"],
        //   api_key: props.oldContent.value.destination["api_key"],
        // });
        setAppDatas({ source: res_source.content.content, destination: {} });
      };

      pullDatas();

      setIsAuthenticationsValid(true);
      setIsModelOpen(true);
      setIsLoading(false);
      setIsSettingsChoice(true);
    }
  }, [props.update]);

  const modalClickRef = useRef();

  const modalBoxHandler = (bool) => {
    setIsModelOpen(bool);
    if (!bool) {
      setIsIntegrationChoice(false);
      setIsSettingsChoice(false);
    }
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

  const settingsChangeHandler = (values, type) => {
    setSelectedSettings((prev) => {
      return { ...prev, [type]: values };
    });
  };

  const saveSettingsHandler = (values, type) => {
    // setSelectedSettings((prev) => {
    //   return { ...prev, [type]: values };
    // });
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
        // action: "create",
      };

      if (props.update) {
        allData.action = "update";
        allData["webhook_id"] = props.oldContent["webhook_id"];
      } else {
        allData.action = "create";
      }

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
                onSettingsChange={settingsChangeHandler}
                onSave={saveSettingsHandler}
                appAction={selectedDatas[settingsChoice][1]}
                type={settingsChoice}
                settingsData={selectedSettings}
                appDatas={appDatas}
              />
            )}
            {isLoading && <div>loading...</div>}
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
