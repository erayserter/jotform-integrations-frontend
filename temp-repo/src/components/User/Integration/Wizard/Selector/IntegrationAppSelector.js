import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";

import classes from "./IntegrationAppSelector.module.css";
import SelectionCard from "./SelectionCard";

import configurations from "../../../../../config/index";

async function getAllUserData(appName) {
  return fetch(
    "https://" +
      configurations.DEV_RDS_NAME +
      ".jotform.dev/intern-api/getAllUserData?app_name=" +
      appName
  ).then((res) => res.json());
}

async function validateApiKey(credentials) {
  return fetch(
    "https://" +
      configurations.DEV_RDS_NAME +
      ".jotform.dev/intern-api/validateApiKey",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  ).then((data) => data.json());
}

const IntegrationAppSelector = (props) => {
  const apps = useSelector((state) => state.apps.apps);

  const [buttonText, setButtonText] = useState("Authenticate");

  const [isAppSelectorVisible, setIsAppSelectorVisible] = useState(true);
  const [accountDetails, setAccountDetails] = useState(null);

  const [selectedApp, setSelectedApp] = useState({
    id: null,
    action: "",
    key: "",
  });

  const appSelectorSectionHandler = (event) => {
    setIsAppSelectorVisible((prev) => !prev);
  };

  const appSelectHandler = async (id) => {
    setIsAppSelectorVisible(false);
    setButtonText("Authenticate");
    setSelectedApp({ id: id, action: "", key: "" });
    const app = Object.values(apps).find((app) => app.id === id);
    if (app.isOauth) {
      setButtonText("...");
      await oauthHandler(app);
    }
  };

  const actionSelectHandler = (value) => {
    setSelectedApp((prev) => {
      return { ...prev, action: value };
    });
  };

  const authHandler = async (event) => {
    const app = Object.values(apps).find((app) => app.id === selectedApp.id);
    if (app.isOauth) {
      setButtonText("...");
      window.open(
        "https://" +
          configurations.DEV_RDS_NAME +
          ".jotform.dev/intern-api/clickUp"
      );
      window.addEventListener("message", (event) => {
        if (
          event.origin ===
          "https://" + configurations.DEV_RDS_NAME + ".jotform.dev"
        ) {
          const data = JSON.parse(event.data);
          if (
            data.responseCode === 200 &&
            data.private_key.toLowerCase() === app.name.toLowerCase()
          ) {
            oauthHandler(app);
          }
        }
      });
    } else {
      setButtonText("...");
      const res = await validateApiKey({
        app_name: app.name.toLowerCase(),
        action: selectedApp.action,
        api_key: selectedApp.key,
      });
      if (res.content.responseCode === 200) {
        setButtonText("Authenticated");
        props.onAuthenticate(
          {
            id: selectedApp.id,
            action: selectedApp.action,
            key: selectedApp.key,
            auth_id: null,
          },
          props.type,
          res.content.content
        );
      }
    }
  };

  const oauthHandler = async (app, data) => {
    const res = await getAllUserData(app.name);
    setAccountDetails(res.content);
  };

  useEffect(() => {
    setSelectedApp({ id: null, action: "", key: "" });
    setIsAppSelectorVisible(true);
    if (props.datas[props.type].id !== null) {
      if (props.isValid) {
        setButtonText("Authenticated");
        setSelectedApp((prev) => {
          return { ...prev, key: props.datas[props.type].key };
        });
        setIsAppSelectorVisible(true);
      } else setIsAppSelectorVisible(false);
      setSelectedApp((prev) => {
        return {
          ...prev,
          id: props.datas[props.type].id,
          action: props.datas[props.type].action,
        };
      });
    }
  }, [props.datas, props.type]);

  const app = Object.values(apps).find((app) => app.id === selectedApp.id);

  return (
    <div
      className={`${classes["app-selector__container"]} flex flex-col relative p-6 h-full gap-3`}
    >
      <div className={`${classes["app-layout-header"]}`}>
        <h1 className="color-navy-700 text-3xl font-semibold m-0 text-center text-capitalize mb-2">
          Choose {props.type} App
        </h1>
      </div>
      <div
        className={`${classes["app-layout-body"]} md:flex items-start mt-12 md:mt-0 md:mb-6 gap-5`}
      >
        <div
          className={`${classes["app-selector"]} flex items-center justify-center relative`}
        >
          {selectedApp.id && (
            <img
              className="cursor-pointer bg-navy-100 p-2 radius"
              src={app.url}
              width="86.3"
              height="86.3"
              onClick={appSelectorSectionHandler}
            />
          )}
          {selectedApp.id && (
            <img
              className={`${classes["switch-app-icon"]} absolute bg-navy-100 opacity-0 duration-300 ease-in-out cursor-pointer bg-navy-100 p-2 radius`}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAFD0lEQVR4nO2bTWwbRRTH/2/WTltie/1FEgGqhBBSBVXUAk2KEFfUSi0NLXBA4s4JcQFBoUh8RZzgzIUDAnGApgkttBIHDghUmiIqxMcBKiEUpCb1erPrNBDHO49DbGudxN5Pb7xOfrednX1+/7/ezuzMyMAOO2xrKIwgmsYZJMxPJeMQMVaJ+Ku8qj5HRFYY8btJYAPmy0ujQlg/ELB7Xeh/Cmp6LxHJoL/RTUSQh+fLS6OKsK5sFA8AfOdNw3gpSPwo8G3AfHlpVFHkFQC7uE0fYjzmN35U+DKgKZ55F6P9eyRIlP2nFg0Jrw/Uy34WjIFO4gGgBvmB/9SiwVMFLOhLBxRhzQLO4sH4eDib/TpIclHgeha4UansVyx5lervfKcHSdBnhUzm6eDpdR9XBvSreMCFAf0sHnAw4Ealsj9hyavoU/FAB03bQTwAKJs1Luj6gQRjFn0uHthEm67rByUplxnsPNURrRLTr13LLkSY+U+L5MvD2ex1e3uLPk3T7oKSvO5KfBxhyBrkyZFcbqbR1PIhxCJ5qW/FAwBBJEl8Ym9q/RIk3rfWr39hYLBUMsYa1+s/hftZexOpyObyvcUACfwdfTrRQkD19mz2u8Z16xjAygSAnt7BCQoTXrRv1W0o+XLZPM6Cp9ndStECUSnUDLsF8xxZ/Eqh0LpC3fSd1wzjCEv+EkTOJkiaLOYzr4aUZuS0HfS2iwltxRVU9ZIUdAzMzmOC4NOlsvlOqJlFhOO0t2AYR4XkC1tZCYZh5KtSfkEkHqzncR2CThXT6d+DxnY172+lCcyc1AxzAUB23R0pRPJEPjN4IUh8V3uCQ6p6cateB71SeRMbxAMACSlrM2Xz1rEg8V1vig6p6kVAnCQX3wlM8rSmG2eCJNaMxXikw+26CeZxv/E97QoXc5kZrtEpJxOICEx4Q9O0+/wm1kCC5xy6CCl5+qZuPu4nvueDkWIxM02SJlxUAklFCTwWWEJMMqPd4VMDQcTnSrp5wmt8XydD+XzmvOCEYyWAMeInvp2RdPoXFnid2ckDCBBPeTXB99lgLjc47WQCQfnGb3w7Q6r6Ngs6AxcmEPGUri8/4TZ24OWvrt+akFQ7u8naQSuomTuIqBr0NxosGMZrQvJboM5pEyAFJ5/M5W475xQz0PE4sFYJNVYeAPAHATUAq8z4dkDQvjDFA2uVIF1UAgNC0urnbiohlhsg3ipBPJXLpac69IknYZkQWwOAcEzY8KRhGEdqTO8yBZ/CIoG5iDYHPHbamdB6LmAYLzDj/ZBT7BnWTEg8lMsN/mRrW4OZE5phLgNIbkl2EUHAX4WsenfjujkNlhYXH0Wfi6+z137RNEBI+W/0uUQPo3Vd0TSgUChcZsZyvVP/wvyb/bLlS9CCfAYMGeu5sTNVWLWj9oYNWucXF+8RoEkC7iWInveCie8Hs5uxqyoTyvhQKnXN3tjzAjtR0o2PQHjWqR8BVcGJw/bpz3YvnoQhvn4/foQlvt4nXngSn9gznksNXHPoFx/CFl/vGw+6IR4IYUcoCrRF80M34gFUawnlkFvxQAwqQFtefphXqt87rflBtGIpYmw4lfrZS3zP/xeInGr1eUfxQFVRdh8upgY8iQdi8AowiT0OXVYs6a3s7fS8ARb4bIfbK5ZUxobz3sreTs+PAcxMmmn+CMbBlnbgPymV8SDigRhUABFxIZMZZ8Z7AM0BmAfTeWHVhoOK32GHHfA/olYyFCa5eMcAAAAASUVORK5CYII="
              width="60"
              height="60"
              onClick={appSelectorSectionHandler}
            />
          )}
        </div>
        {selectedApp.id && (
          <div className={`${classes["key-action-selector"]} basis-10/12`}>
            <div className={`${classes["action-selector"]} relative`}>
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
                value={{ label: selectedApp.action, value: selectedApp.action }}
              />
            </div>
            {app && app.isOauth ? (
              <div className={`${classes["oauth"]} mt-2`}>
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
                            id: selectedApp.id,
                            action: selectedApp.action,
                            key: null,
                            auth_id: selectedAccount.auth_user_id,
                          },
                          props.type,
                          selectedAccount
                        );
                      }}
                    />
                  </div>
                ) : (
                  <button
                    className={`${classes["app-selector__oauth"]} mt-5 mb-1 mx-auto flex items-center justify-center h-10 min-w-28 px-5 py-0.5 text-center text-uppercase duration-300 color-white grow-1 border border-solid radius`}
                    onClick={authHandler}
                  >
                    {buttonText}
                  </button>
                )}
              </div>
            ) : (
              <div className={`${classes["key-selector"]} mt-2`}>
                <span>API Key</span>
                <div
                  className={`${classes["key-input"]} flex justify-between gap-2`}
                >
                  <input
                    className="w-0 grow-1 shrink-1 basis-3/5 block border border-solid border-navy-100 radius color-navy-700 font-light h-10 px-4 duration-300"
                    placeholder="API Key Here."
                    onChange={(e) => {
                      setButtonText("Authenticate");
                      setSelectedApp((prev) => {
                        return { ...prev, key: e.target.value };
                      });
                    }}
                    value={selectedApp.key}
                  />
                  <button
                    className="flex items-center justify-center h-10 min-w-28 px-5 py-0.5 text-center text-uppercase duration-300 color-white border border-solid radius"
                    onClick={authHandler}
                  >
                    {buttonText}
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
