import React, { Fragment, useState } from "react";
import IntegrationApp from "./Apps/IntegrationApp";

import classes from "./SelectionCard.module.css";

const SelectionCard = (props) => {
  const [searchedWord, setSearchedWord] = useState("");

  const appSelectHandler = (id) => {
    props.onAppSelect(id);
  };

  const fullContent = props.apps.map((e) => {
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

  const filteredContent = props.apps
    .filter((e) => e.name.includes(searchedWord))
    .map((e) => {
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
