import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";

import classes from "./IntegrationAppSelector.module.css";
import SelectionCard from "./SelectionCard";

import configurations from "../../../../../config/index";
import { setAppSelections } from "../../../../../store/inputs";
import { isNil } from "lodash";

const IntegrationAppSelector = (props) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [isAppSelectorVisible, setIsAppSelectorVisible] = useState(true);
  const [accountDetails, setAccountDetails] = useState([]);

  const apiInfo = useSelector((state) => state.infos.apiInfo);

  const appSelections = useSelector((state) => state.inputs.appSelections);
  const app = appSelections[props.type].app;

  const appSelectorSectionHandler = (event) => {
    setIsAppSelectorVisible((prev) => !prev);
  };

  const appSelectHandler = (selectedApp) => {
    if (!isNil(app) && selectedApp.isSameApp(app)) return;

    setIsAppSelectorVisible(false);

    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          [props.type]: {
            app: selectedApp,
            action: null,
            key: null,
            auth_id: null,
          },
        },
      })
    );
  };

  const actionSelectHandler = (value) => {
    const actions = app.triggers.concat(app.actions);
    const action = actions.find((action) => action.name === value);

    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          [props.type]: {
            ...appSelections[props.type],
            action: action,
          },
        },
      })
    );
  };

  const keySelectHandler = (event) => {
    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          [props.type]: {
            ...appSelections[props.type],
            key: event.target.value,
          },
        },
      })
    );
  };

  const authHandler = async (event) => {
    setIsLoading(true);
    if (app.isOauth) {
      window.open(
        "https://" +
          configurations.DEV_RDS_NAME +
          ".jotform.dev/intern-api/" +
          app.id.charAt(0).toLowerCase() +
          app.id.slice(1)
      );
      window.addEventListener("message", (event) => {
        if (
          event.origin ===
          "https://" + configurations.DEV_RDS_NAME + ".jotform.dev"
        ) {
          const data = JSON.parse(event.data);
          if (
            data.responseCode === 200 &&
            data.private_key.toLowerCase() === app.id.toLowerCase()
          ) {
            oauthHandler(app);
          }
        }
      });
    } else {
      const res = await app.authenticate({
        app_name: app.id.toLowerCase(),
        action: appSelections[props.type].action.name,
        api_key: appSelections[props.type].key,
      });
      if (res.responseCode === 200) {
        props.onAuthenticate(
          {
            app: app,
            action: appSelections[props.type].action,
            key: appSelections[props.type].key,
            auth_id: null,
          },
          props.type
        );
      }
    }
    setIsLoading(false);
  };

  const oauthHandler = async (app, data) => {
    const res = await app.authenticate(app.id);
    setAccountDetails(res.content);
    setIsLoading(false);
  };

  useEffect(() => {
    if (app !== null) {
      if (app.isOauth && accountDetails.length <= 0) {
        setIsLoading(true);
        oauthHandler(app);
      }
      if (apiInfo[props.type]) {
        setIsAppSelectorVisible(true);
      } else {
        setIsAppSelectorVisible(false);
      }
    }
  }, [app, apiInfo, props.type, accountDetails.length]);

  return (
    <div
      className={`${classes["app-selector__container"]} flex flex-col relative p-6 h-full gap-3`}
    >
      <div className={`${classes["app-layout-header"]}`}>
        <h1 className="color-navy-700 text-3xl font-semibold m-0 text-center text-capitalize mb-2">
          Choose {props.type} App
        </h1>
      </div>
      <div className={`md:flex items-start mt-12 md:mt-0 md:mb-6 gap-5`}>
        <div
          className={`${classes["app-selector"]} flex items-center justify-center relative`}
        >
          {app && (
            <img
              className="cursor-pointer bg-navy-100 p-2 radius"
              src={app.url}
              width="86.3"
              height="86.3"
              onClick={appSelectorSectionHandler}
              alt={app.name}
            />
          )}
          {app && (
            <img
              className={`${classes["switch-app-icon"]} absolute bg-navy-100 opacity-0 duration-300 ease-in-out cursor-pointer bg-navy-100 p-2 radius`}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAFD0lEQVR4nO2bTWwbRRTH/2/WTltie/1FEgGqhBBSBVXUAk2KEFfUSi0NLXBA4s4JcQFBoUh8RZzgzIUDAnGApgkttBIHDghUmiIqxMcBKiEUpCb1erPrNBDHO49DbGudxN5Pb7xOfrednX1+/7/ezuzMyMAOO2xrKIwgmsYZJMxPJeMQMVaJ+Ku8qj5HRFYY8btJYAPmy0ujQlg/ELB7Xeh/Cmp6LxHJoL/RTUSQh+fLS6OKsK5sFA8AfOdNw3gpSPwo8G3AfHlpVFHkFQC7uE0fYjzmN35U+DKgKZ55F6P9eyRIlP2nFg0Jrw/Uy34WjIFO4gGgBvmB/9SiwVMFLOhLBxRhzQLO4sH4eDib/TpIclHgeha4UansVyx5lervfKcHSdBnhUzm6eDpdR9XBvSreMCFAf0sHnAw4Ealsj9hyavoU/FAB03bQTwAKJs1Luj6gQRjFn0uHthEm67rByUplxnsPNURrRLTr13LLkSY+U+L5MvD2ex1e3uLPk3T7oKSvO5KfBxhyBrkyZFcbqbR1PIhxCJ5qW/FAwBBJEl8Ym9q/RIk3rfWr39hYLBUMsYa1+s/hftZexOpyObyvcUACfwdfTrRQkD19mz2u8Z16xjAygSAnt7BCQoTXrRv1W0o+XLZPM6Cp9ndStECUSnUDLsF8xxZ/Eqh0LpC3fSd1wzjCEv+EkTOJkiaLOYzr4aUZuS0HfS2iwltxRVU9ZIUdAzMzmOC4NOlsvlOqJlFhOO0t2AYR4XkC1tZCYZh5KtSfkEkHqzncR2CThXT6d+DxnY172+lCcyc1AxzAUB23R0pRPJEPjN4IUh8V3uCQ6p6cateB71SeRMbxAMACSlrM2Xz1rEg8V1vig6p6kVAnCQX3wlM8rSmG2eCJNaMxXikw+26CeZxv/E97QoXc5kZrtEpJxOICEx4Q9O0+/wm1kCC5xy6CCl5+qZuPu4nvueDkWIxM02SJlxUAklFCTwWWEJMMqPd4VMDQcTnSrp5wmt8XydD+XzmvOCEYyWAMeInvp2RdPoXFnid2ckDCBBPeTXB99lgLjc47WQCQfnGb3w7Q6r6Ngs6AxcmEPGUri8/4TZ24OWvrt+akFQ7u8naQSuomTuIqBr0NxosGMZrQvJboM5pEyAFJ5/M5W475xQz0PE4sFYJNVYeAPAHATUAq8z4dkDQvjDFA2uVIF1UAgNC0urnbiohlhsg3ipBPJXLpac69IknYZkQWwOAcEzY8KRhGEdqTO8yBZ/CIoG5iDYHPHbamdB6LmAYLzDj/ZBT7BnWTEg8lMsN/mRrW4OZE5phLgNIbkl2EUHAX4WsenfjujkNlhYXH0Wfi6+z137RNEBI+W/0uUQPo3Vd0TSgUChcZsZyvVP/wvyb/bLlS9CCfAYMGeu5sTNVWLWj9oYNWucXF+8RoEkC7iWInveCie8Hs5uxqyoTyvhQKnXN3tjzAjtR0o2PQHjWqR8BVcGJw/bpz3YvnoQhvn4/foQlvt4nXngSn9gznksNXHPoFx/CFl/vGw+6IR4IYUcoCrRF80M34gFUawnlkFvxQAwqQFtefphXqt87rflBtGIpYmw4lfrZS3zP/xeInGr1eUfxQFVRdh8upgY8iQdi8AowiT0OXVYs6a3s7fS8ARb4bIfbK5ZUxobz3sreTs+PAcxMmmn+CMbBlnbgPymV8SDigRhUABFxIZMZZ8Z7AM0BmAfTeWHVhoOK32GHHfA/olYyFCa5eMcAAAAASUVORK5CYII="
              width="60"
              height="60"
              onClick={appSelectorSectionHandler}
              alt="Switch Icon"
            />
          )}
        </div>
        {app && (
          <div className={`basis-10/12`}>
            <div className={`relative`}>
              <span>Action</span>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="actions"
                options={
                  props.type === "source"
                    ? app.triggers.map((e) => {
                        return { value: e.name, label: e.name };
                      })
                    : app.actions.map((e) => {
                        return { value: e.name, label: e.name };
                      })
                }
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                menuPlacement="bottom"
                onChange={(e) => {
                  if (e) actionSelectHandler(e.value);
                }}
                value={
                  appSelections[props.type].action && {
                    label: appSelections[props.type].action.name,
                    value: appSelections[props.type].action.name,
                  }
                }
              />
            </div>
            {app && app.isOauth ? (
              <div className={`mt-2`}>
                {accountDetails && accountDetails.length > 0 ? (
                  <div>
                    <span>Account</span>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      name="actions"
                      options={accountDetails.map((e) => {
                        return { value: e.auth_user_id, label: e.user_name };
                      })}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={document.body}
                      menuPlacement="bottom"
                      onChange={(e) => {
                        const selectedAccount = accountDetails.find(
                          (account) => account.auth_user_id === e.value
                        );
                        props.onAuthenticate(
                          {
                            app: app,
                            action: appSelections[props.type].action,
                            key: appSelections[props.type].key,
                            auth_id: selectedAccount.auth_user_id,
                          },
                          props.type,
                          selectedAccount
                        );
                      }}
                      value={{
                        value: appSelections.auth_id,
                        label: accountDetails.find(
                          (account) =>
                            account.auth_user_id ===
                            appSelections[props.type].auth_id
                        )?.user_name,
                      }}
                    />
                  </div>
                ) : (
                  <button
                    className={`mt-5 mb-1 mx-auto flex items-center justify-center h-10 min-w-28 px-5 py-0.5 text-center text-uppercase duration-300 color-white grow-1 border border-solid radius`}
                    onClick={authHandler}
                  >
                    {isLoading
                      ? "..."
                      : apiInfo[props.type]
                      ? "Authenticated"
                      : "Authenticate"}
                  </button>
                )}
              </div>
            ) : (
              <div className={`mt-2`}>
                <span>API Key</span>
                <div className={`flex justify-between gap-2`}>
                  <input
                    className="w-0 grow-1 shrink-1 basis-3/5 block border border-solid border-navy-100 radius color-navy-700 font-light h-10 px-4 duration-300"
                    placeholder="API Key Here."
                    onChange={keySelectHandler}
                    value={appSelections[props.type].key || ""}
                  />
                  <button
                    className="flex items-center justify-center h-10 min-w-28 px-5 py-0.5 text-center text-uppercase duration-300 color-white border border-solid radius"
                    onClick={authHandler}
                  >
                    {isLoading
                      ? "..."
                      : apiInfo[props.type]
                      ? "Authenticated"
                      : "Authenticate"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {isAppSelectorVisible && <SelectionCard onAppSelect={appSelectHandler} />}

      <div className={`${classes["pointer"]} absolute flex top-3 gap-3`}>
        <div
          className={`${classes["pointer__circle"]} ${
            classes["pointer__circle-source"]
          } ${
            props.type === "source" && "bg-navy-700"
          } w-3 h-3 bg-navy-100 cursor-pointer radius-full`}
          onClick={(event) => {
            props.onTypeChange("source");
          }}
        />
        <div
          className={`${classes["pointer__circle"]} ${
            classes["pointer__circle-destination"]
          } ${
            props.type === "destination" && "bg-navy-700"
          } w-3 h-3 bg-navy-100 cursor-pointer radius-full`}
          onClick={(event) => {
            props.onTypeChange("destination");
          }}
        />
      </div>
    </div>
  );
};

export default IntegrationAppSelector;
