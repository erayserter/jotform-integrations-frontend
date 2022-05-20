import React, { Fragment } from "react";
import IntegrationApp from "./Apps/IntegrationApp";

import classes from "./SelectionCard.module.css";

const SelectionCard = (props) => {
  const appSelectHandler = (id) => {
    props.onAppSelect(id);
  };

  return (
    <Fragment>
      <div className={classes["app-search"]}>
        <img
          src="https://img.icons8.com/material-outlined/384/000000/search--v1.png"
          alt=""
        />
        <input placeholder="Search Available App" />
      </div>
      <div className={classes["app-navigation"]}>
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          name="Telegram"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
        <IntegrationApp
          onAppSelect={appSelectHandler}
          appId="1"
          appImg="https://img.icons8.com/color/480/000000/telegram-app--v1.png"
        />
      </div>
    </Fragment>
  );
};

export default SelectionCard;
