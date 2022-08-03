import React, { useEffect } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import InputContainer from "../../../../UI/InputContainer";
import TagInputContainer from "../../../../UI/TagInputContainer";
import MatchFieldsContainer from "../../../../UI/MatchFieldsContainer";

import classes from "./IntegrationSettings.module.css";

import { setOptions } from "../../../../../store/apps";
import { setAppInfo } from "../../../../../store/infos";

const IntegrationSettings = (props) => {
  const dispatch = useDispatch();
  const appOptions = useSelector((state) => state.apps.options);

  const userInputs = useSelector((state) => state.inputs);

  const appSelections = userInputs.appSelections;
  const settingsSelections = userInputs.settingsSelections;

  const app = appSelections[props.type].app;
  const appAction = appSelections[props.type].action;

  const appInfo = useSelector((state) => state.infos.appInfo);

  const appFields = app.getFields(props.type, appAction.name);

  useEffect(() => {
    fetchData();
  }, [props.type, settingsSelections, appAction]);

  const fetchData = async () => {
    const authenticationInfo = {
      apiKey: appSelections[props.type].key,
      authId: appSelections[props.type].auth_id,
    };
    // { newOptions: optionsCopy, newDatas: newDatas }
    const { newDatas, newOptions } = await app.init(
      appInfo,
      appAction.name,
      props.type,
      authenticationInfo,
      settingsSelections
    );

    dispatch(setAppInfo({ appInfo: newDatas }));
    dispatch(setOptions({ options: { ...appOptions, [app.id]: newOptions } }));
  };

  const newValueHandler = (value, labelData, isExternal) => {
    props.onSettingsChange(value, props.type, labelData, isExternal);
  };

  const saveHandler = (event) => {
    props.onSave(settingsSelections[props.type], props.type);
  };

  return (
    <div
      className={`${classes["settings--container"]} md:block flex flex-col justify-between pt-5 px-5 h-full`}
    >
      <h1
        className={`color-navy-700 text-3xl font-semibold pt-1 text-center ${
          props.type !== "source" && "pl-14"
        }`}
      >
        {app.name} Settings
      </h1>
      <div>
        {appFields.map((e) => {
          if (e.type === "select") {
            if (
              appOptions[app.id][e.selection] == null ||
              appOptions[app.id][e.selection].length <= 0
            )
              return null;
            return (
              <div
                key={e.selection}
                className={`${classes["select--container"]} py-5 border-b border-solid`}
              >
                <label className="block mb-2 text-sm font-semibold">
                  {e.label}
                </label>
                <Select
                  isMulti={e.isMulti}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  name="actions"
                  options={appOptions[app.id][e.selection]}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                  menuPlacement="bottom"
                  onChange={(event) => {
                    if (e.isMulti) {
                      newValueHandler(
                        event.map((element) => {
                          return parseInt(element.value, 10);
                        }),
                        e.selection
                      );
                    } else newValueHandler(event.value, e.selection);
                  }}
                  value={
                    settingsSelections[props.type][e.selection] != null &&
                    (e.isMulti
                      ? settingsSelections[props.type][e.selection].map(
                          (input) =>
                            appOptions[app.id][e.selection].find(
                              (option) => option.value === input
                            )
                        )
                      : appOptions[app.id][e.selection].find(
                          (option) =>
                            option.value ===
                            settingsSelections[props.type][e.selection]
                        ))
                  }
                />
              </div>
            );
          } else if (e.type === "tagInput") {
            if (
              appOptions[app.id][e.selection] == null ||
              appOptions[app.id][e.selection].length <= 0
            )
              return null;
            return (
              <TagInputContainer
                key={e.selection}
                label={e.label}
                onChange={(value) => {
                  newValueHandler(value, e.selection);
                }}
                defaultValue={settingsSelections[props.type][e.selection]}
                whitelist={appOptions[app.id][e.selection]}
              />
            );
          } else if (e.type === "matchFields") {
            if (
              appOptions[app.id][e.selection] == null ||
              appOptions[app.id][e.selection].source.length <= 0 ||
              appOptions[app.id][e.selection].destination.length <= 0
            )
              return null;
            return (
              <MatchFieldsContainer
                key={e.selection}
                label={e.label}
                maxLength={4}
                datas={appOptions[app.id][e.selection]}
                default={settingsSelections[props.type][e.selection]}
                onChange={(value) => {
                  newValueHandler(value, e.selection);
                }}
              />
            );
          } else
            return (
              <InputContainer
                key={e.selection}
                inputLabel={e.label}
                inputType={e.type}
                setter={(value) => newValueHandler(value, e.selection)}
                default={settingsSelections[props.type][e.selection]}
              />
            );
        })}
        <button
          className={`${classes["settings--sendButton"]} flex items-center justify-center mt-6 mb-5 mx-auto bg-orange-500 color-white border border-solid radius h-10 min-w-28 px-4 text-center text-uppercase duration-300`}
          onClick={saveHandler}
        >
          {props.type === "source" ? "Next" : "Save Settings"}
        </button>
      </div>
      {props.type !== "source" && (
        <button
          className={`cursor-pointer absolute radius-full left-4 top-4 md:top-5 md:left-5 p-3 bg-navy-75`}
          onClick={() => props.onPreviousModal("source")}
        >
          <img
            width="16"
            height="16"
            alt="previous button"
            src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/undefined/external-left-arrow-arrows-dreamstale-lineal-dreamstale.png"
          />
        </button>
      )}
    </div>
  );
};

export default IntegrationSettings;
