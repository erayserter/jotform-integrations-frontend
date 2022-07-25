import React, { useState } from "react";
import { useSelector } from "react-redux";

import IntegrationApp from "./Apps/IntegrationApp";

import classes from "./SelectionCard.module.css";

const SelectionCard = (props) => {
  const apps = useSelector((state) => state.apps.apps);

  const [searchedWord, setSearchedWord] = useState("");

  const appSelectHandler = (id) => {
    props.onAppSelect(id);
  };

  const fullContent = Object.values(apps).map((app) => {
    return (
      <li key={app.id} className="basis-1/3">
        <IntegrationApp
          className="flex justify-center"
          onAppSelect={appSelectHandler}
          id={app.id}
          img={app.url}
          name={app.name}
        />
      </li>
    );
  });

  const filteredContent = Object.values(apps)
    .filter((e) => e.name.includes(searchedWord))
    .map((app) => {
      return (
        <li key={app.id} className="basis-1/3">
          <IntegrationApp
            className="flex justify-center"
            onAppSelect={appSelectHandler}
            id={app.id}
            img={app.url}
            name={app.name}
          />
        </li>
      );
    });

  return (
    <div
      className={`${classes["container"]} flex md:block flex-col grow-1 md:h-auto justify-end`}
    >
      <div
        className={`${classes["app-search"]} flex items-center justify-start border border-solid radius border-navy-100 py-0 px-4 order-last`}
      >
        <img
          className="w-5"
          src="https://img.icons8.com/material-outlined/384/000000/search--v1.png"
          alt=""
        />
        <input
          className="font-light h-10 px-4 w-full"
          onChange={(e) => {
            setSearchedWord(e.target.value);
          }}
          placeholder="Search Available App"
        />
      </div>
      <div className={`${classes["app-navigation"]} my-6`}>
        <ul className="flex flex-wrap items-center">
          {searchedWord === "" ? fullContent : filteredContent}
        </ul>
      </div>
    </div>
  );
};

export default SelectionCard;
