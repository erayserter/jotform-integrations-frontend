import React, { useState, useEffect, createRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { omit } from "lodash";

import { setPrefills } from "../../../store/prefills";
import { setApiInfo } from "../../../store/infos";
import { setAppSelections } from "../../../store/inputs";
import {
  newSettingsHandler,
  setSettingsSelections,
} from "../../../store/inputs";

import IntegrationTitle from "../Integration/Header/IntegrationTitle";
import IntegrationAppCard from "../Integration/Wizard/IntegrationAppCard";
import ModalBox from "../../UI/ModalBox";
import IntegrationAppSelector from "../Integration/Wizard/Selector/IntegrationAppSelector";
import IntegrationSettings from "../Integration/Wizard/Settings/IntegrationSettings";

import classes from "./PrefillWizard.module.css";
import Jotform from "../../../data/apps/Jotform";
import UserPrefillContentSection from "./UserPrefillContentSection";

const PrefillWizard = ({ prefillsLoading, onClose }) => {
  const dispatch = useDispatch();
  const prefills = useSelector((state) => state.prefills.prefills);
  const appSelections = useSelector((state) => state.inputs.appSelections);
  const settingsSelections = useSelector(
    (state) => state.inputs.settingsSelections
  );

  const [isModelOpen, setIsModelOpen] = useState(true);
  const [isAppChoice, setIsAppChoice] = useState(true);
  const [isSettingsChoice, setIsSettingsChoice] = useState(false);
  const [isPrefillChoice, setIsPrefillChoice] = useState(false);
  const [settingsChoice, setSettingsChoice] = useState("source");
  const [appChoice, setAppChoice] = useState("source");

  const apiInfo = useSelector((state) => state.infos.apiInfo);

  const [popperRefs, setPopperRefs] = useState({});

  useEffect(() => {
    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          source: {
            app: new Jotform(),
            action: undefined,
            key: undefined,
            auth_id: undefined,
          },
        },
      })
    );
  }, []);

  const popperRefChangeHandler = (selection) => {
    if (!popperRefs[selection])
      setPopperRefs((prev) => ({ ...prev, [selection]: createRef() }));
    else setPopperRefs((prev) => omit(prev, selection));
  };

  const prefillChoiceHandler = (appCardProps) => {
    setIsAppChoice(true);
    setIsModelOpen(true);
  };

  const modalBoxHandler = (bool) => {
    setIsModelOpen(bool);
    if (!bool) {
      setIsAppChoice(false);
      setIsSettingsChoice(false);
    }
  };

  const authHandler = (datas, type) => {
    const valid = { ...apiInfo, [type]: true };
    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          [type.toLowerCase()]: datas,
        },
      })
    );

    dispatch(setApiInfo({ apiInfo: valid }));

    if (type === "prefill") {
      setIsAppChoice(false);
      setIsSettingsChoice(true);
    } else setAppChoice("prefill");
  };

  const settingsHandler = () => {
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

  const saveSettingsHandler = async () => {
    if (settingsChoice === "source") {
      setSettingsChoice("prefill");
      return;
    }

    const jotform = appSelections.source.app;
    const prefill_app = appSelections.prefill.app;

    const prefillResponse = await prefill_app.createPrefill(
      appSelections,
      settingsSelections
    );

    dispatch(
      setPrefills({
        prefills: [
          ...prefills,
          ...prefillResponse.map((prefill) => ({
            id: prefill.contact_id,
            url: prefill.url,
            title: settingsSelections.prefill.prefill_title,
          })),
        ],
      })
    );

    setIsSettingsChoice(false);
    setIsPrefillChoice(true);

    toast.success("Successfully created a prefill!");
  };

  return (
    <>
      <IntegrationTitle
        title="Prefill"
        subtitle="Select an application to easly create a prefill."
      />
      <div
        className={`${classes["prefill-body"]} flex flex-col grow-1 min-h-76`}
      >
        <div
          className={`${classes["prefill-card"]} flex flex-col m-0 justify-center items-center duration-700 delay-500`}
        >
          <IntegrationAppCard
            onClick={prefillChoiceHandler}
            text="Fill from"
            type="prefill"
          />
        </div>
      </div>
      {apiInfo.prefill && (
        <div>
          <button
            className={`${classes["settingsButton"]} flex justify-center items-center text-md h-10 mx-auto mt-5 mb-0 py-1 px-6 text-center text-uppercase duration-300 cursor-pointer color-white border border-solid radius `}
            onClick={settingsHandler}
          >
            Settings
          </button>
        </div>
      )}

      {isModelOpen && (
        <ModalBox onModalBoxClose={modalBoxHandler} refs={popperRefs}>
          {isAppChoice && (
            <IntegrationAppSelector
              onAuthenticate={authHandler}
              type={appChoice}
              prefillSelector
              onTypeChange={setAppChoice}
            />
          )}
          {isSettingsChoice && (
            <IntegrationSettings
              popperRefs={popperRefs}
              onPopperRefChange={popperRefChangeHandler}
              onSettingsChange={settingsChangeHandler}
              onSave={saveSettingsHandler}
              onPreviousModal={setSettingsChoice}
              prefillSettings
              type={settingsChoice}
            />
          )}
          {isPrefillChoice && (
            <>
              <div className="mb-5">
                <IntegrationTitle title="Your Prefills" />
              </div>
              <UserPrefillContentSection
                content={{ header: "Prefills", value: "Prefills" }}
                prefillsLoading={prefillsLoading}
                onClose={onClose}
              />
              <button
                className={`${classes["doneButton"]} flex items-center justify-center mt-6 mb-5 mx-auto bg-orange-500 color-white border border-solid radius h-10 min-w-28 px-4 text-center text-uppercase duration-300`}
                onClick={onClose}
              >
                Done
              </button>
            </>
          )}
        </ModalBox>
      )}
    </>
  );
};

export default PrefillWizard;
