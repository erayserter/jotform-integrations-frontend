import React, { Fragment, useState } from "react";
import IntegrationApp from "./Apps/IntegrationApp";

import classes from "./SelectionCard.module.css";

const APPS = [
  {
    id: "1",
    name: "Telegram",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
  },
  {
    id: "2",
    name: "Whatsapp",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
  },
  {
    id: "3",
    name: "Google Docs",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
  },
  {
    id: "4",
    name: "Telegram",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
  },
  {
    id: "5",
    name: "Telegram",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
  },
  {
    id: "6",
    name: "Telegram",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
  },
  {
    id: "7",
    name: "Telegram",
    img: "https://img.icons8.com/color/480/000000/telegram-app--v1.png",
  },
];

const SelectionCard = (props) => {
  const [searchedWord, setSearchedWord] = useState("");

  const appSelectHandler = (id) => {
    props.onAppSelect(id);
  };

  const fullContent = APPS.map((e) => {
    return (
      <IntegrationApp
        onAppSelect={appSelectHandler}
        key={e.id}
        id={e.id}
        img={e.img}
        name={e.name}
      />
    );
  });

  var filteredContent = APPS.filter((e) => e.name.includes(searchedWord)).map(
    (e) => {
      return (
        <IntegrationApp
          onAppSelect={appSelectHandler}
          key={e.id}
          id={e.id}
          img={e.img}
          name={e.name}
        />
      );
    }
  );

  return (
    <Fragment>
      <div className={classes["app-search"]}>
        <img
          src="https://img.icons8.com/material-outlined/384/000000/search--v1.png"
          alt=""
        />
        <input
          onChange={(e) => {
            setSearchedWord(e.target.value);
          }}
          placeholder="Search Available App"
        />
      </div>
      <div className={classes["app-navigation"]}>
        {searchedWord == "" ? fullContent : filteredContent}
      </div>
    </Fragment>
  );
};

export default SelectionCard;
