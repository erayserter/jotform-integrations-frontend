import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import classes from "./IntegrationWizard.module.css";

import IntegrationAppCard from "./IntegrationAppCard";
import ModalBox from "../../../UI/ModalBox";
import IntegrationAppSelector from "./Selector/IntegrationAppSelector";
import IntegrationSettings from "./Settings/IntegrationSettings";
import IntegrationTitle from "../Header/IntegrationTitle";
import { setApiInfo, setAppInfo } from "../../../../store/infos";
import {
  setAppSelections,
  setSettingsSelections,
  newSettingsHandler,
} from "../../../../store/inputs";

import { cloneDeep } from "lodash";

const IntegrationWizard = (props) => {
  const dispatch = useDispatch();

  const isTemplate = useSelector((state) => state.ui.isTemplate);
  const isUpdate = useSelector((state) => state.ui.isUpdate);

  const [appType, setAppType] = useState("source");
  const [settingsChoice, setSettingsChoice] = useState("source");

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAppChoice, setIsAppChoice] = useState(false);
  const [isSettingsChoice, setIsSettingsChoice] = useState(false);

  const apiInfo = useSelector((state) => state.infos.apiInfo);
  const appInfo = useSelector((state) => state.infos.appInfo);

  const appSelections = useSelector((state) => state.inputs.appSelections);
  const settingsSelections = useSelector(
    (state) => state.inputs.settingsSelections
  );

  const apiStatusValid = apiInfo.source && apiInfo.destination;

  useEffect(() => {
    if (appSelections.source.app) {
      if (isUpdate) {
        if (apiStatusValid) {
          setIsModelOpen(true);
          setIsSettingsChoice(true);
        }
      } else if (isTemplate) {
        integrationChoiceHandler(true, "source");
      }
    }
  }, [isUpdate, isTemplate]);

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
    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          source: appSelections.destination,
          destination: appSelections.source,
        },
      })
    );
    dispatch(
      setSettingsSelections({
        settingsSelections: { source: {}, destination: {} },
      })
    );
  };

  const authHandler = (datas, type, appDatas) => {
    const valid = { ...apiInfo, [type]: true };
    setIsModelOpen(false);
    setIsAppChoice(false);
    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          [type.toLowerCase()]: datas,
        },
      })
    );

    dispatch(setAppInfo({ appInfo: { ...appInfo, [type]: appDatas } }));
    dispatch(setApiInfo({ apiInfo: valid }));

    if (!valid.source) integrationChoiceHandler(true, "source");
    else if (!valid.destination) integrationChoiceHandler(true, "destination");
  };

  const settingsHandler = (event) => {
    setIsAppChoice(false);
    setIsSettingsChoice(true);
    setIsModelOpen(true);
  };

  const settingsChangeHandler = (value, type, label, isExternal) => {
    if (!isExternal) dispatch(newSettingsHandler({ type, value, label }));
    else
      dispatch(
        setSettingsSelections({
          settingsSelections: { ...settingsSelections, [label]: value },
        })
      );
  };

  const saveSettingsHandler = (values, type) => {
    if (settingsChoice === "source") {
      setSettingsChoice("destination");
    } else {
      const source_app = appSelections.source.app;
      const destination_app = appSelections.destination.app;

      const allData = {
        source: {
          app_name: source_app.name,
          app_action: appSelections.source.action.name,
          api_key: appSelections.source.key,
          auth_user_id: appSelections.source.auth_id,
          settings: settingsSelections.source,
        },
        destination: {
          app_name: destination_app.name,
          app_action: appSelections.destination.action.name,
          api_key: appSelections.destination.key,
          auth_user_id: appSelections.destination.auth_id,
          settings: settingsSelections.destination,
        },
        webhook_name: appSelections.name,
      };

      if (isUpdate) {
        allData.action = "update";
        allData["webhook_id"] = appSelections.webhookId;
      } else {
        allData.action = "create";
      }

      props.onIntegrationSave(allData, isUpdate);
    }
  };

  const typeChangeHandler = (type) => {
    setAppType(type);
  };

  const inlineWebhookNameHandler = (name) => {
    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          name: name,
        },
      })
    );
  };

  return (
    <>
      <IntegrationTitle
        isTitleInlineEdit={true}
        titleValue={appSelections.name}
        titleSetValue={inlineWebhookNameHandler}
        subtitle="Select applications to easly create an integration between them."
      />
      <div
        className={`${classes["integration-body"]} flex flex-col grow-1 min-h-76`}
      >
        <div
          className={`${classes["cards"]} flex flex-col m-0 justify-center items-center duration-700 delay-500`}
        >
          <IntegrationAppCard
            onClick={(data) => {
              integrationChoiceHandler(true, data.type);
            }}
            text="Source"
            type="source"
          />
          <div
            className={`${classes["switch-icon"]} flex justify-center items-center mt-6 md:mt-0 w-10 h-10 md:mb-16 md:h-auto cursor-pointer`}
            onClick={switchHandler}
          >
            <img
              src="https://img.icons8.com/ios-glyphs/100/000000/refresh--v2.png"
              alt=""
            />
          </div>
          <IntegrationAppCard
            onClick={(data) => {
              integrationChoiceHandler(true, data.type);
            }}
            text="Destination"
            type="destination"
          />
        </div>
        {isUpdate && !apiStatusValid && (
          <span
            className={`${classes["wizard--invalid-auth"]} block color-red-500 text-lg text-center w-full font-bold mx-auto mt-5 mb-0 py-1 px-6`}
          >
            Authentication is required!
          </span>
        )}
        {apiStatusValid && (
          <div className={classes["settingContainer"]}>
            <button
              className={`${classes["settingsButton"]} flex justify-center items-center text-md h-10 mx-auto mt-5 mb-0 py-1 px-6 text-center text-uppercase duration-300 cursor-pointer color-white border border-solid radius `}
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
                onAuthenticate={authHandler}
                type={appType}
                onTypeChange={typeChangeHandler}
              />
            )}
            {isSettingsChoice && (
              <IntegrationSettings
                onSettingsChange={settingsChangeHandler}
                onSave={saveSettingsHandler}
                onPreviousModal={setSettingsChoice}
                type={settingsChoice}
              />
            )}
          </ModalBox>
        )}
      </div>
    </>
  );
};

export default IntegrationWizard;
