import React, { useState } from "react";
import IntegrationApp from "./Apps/IntegrationApp";

import classes from "./SelectionCard.module.css";

const SelectionCard = (props) => {
  const [searchedWord, setSearchedWord] = useState("");

  const appSelectHandler = (id) => {
    props.onAppSelect(id);
  };

  const fullContent = props.apps.map((e) => {
    return (
      <li key={e.id}>
        <IntegrationApp
          className="flex justify-center"
          onAppSelect={appSelectHandler}
          id={e.id}
          img={e.img}
          name={e.name}
        />
      </li>
    );
  });

  const filteredContent = props.apps
    .filter((e) => e.name.includes(searchedWord))
    .map((e) => {
      return (
        <li key={e.id}>
          <IntegrationApp
            className="flex justify-center"
            onAppSelect={appSelectHandler}
            id={e.id}
            img={e.img}
            name={e.name}
          />
        </li>
      );
    });

  return (
    <>
      <div
        className={`${classes["app-search"]} flex items-center justify-start border border-solid radius border-navy-100 py-0 px-4`}
      >
        <img
          className="w-5"
          src="https://img.icons8.com/material-outlined/384/000000/search--v1.png"
          alt=""
        />
        <input
          className="bg-navy-700 font-light h-10 px-4 w-full"
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
    </>
  );
};

export default SelectionCard;
