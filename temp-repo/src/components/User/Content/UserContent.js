import React, { useState } from "react";

import classes from "./UserContent.module.css";
import UserContentNavigationItem from "./UserContentNavigationItem";

import UserContentSection from "./List/UserContentSection";

const LIST_ITEMS = ["Integrations", "Templates", "Keys", "Favorites", "Trash"];

const UserContent = (props) => {
  const [sectionContent, setSectionContent] = useState("All Integrations");
  const [searchedWord, setSearchedWord] = useState("");

  const sectionContentHandler = (content) => {
    setSectionContent(content);
  };

  const clickHandler = (event) => {
    props.onNewIntegration(true);
  };

  return (
    <main className={classes["user--main"]}>
      <div className={classes["user--navigation"]}>
        <div className={classes["user--sidebarbutton"]}>
          <button onClick={clickHandler}>Create New Integration</button>
        </div>
        <div className={classes["user--sidebarmenu"]}>
          <h2>My Integrations</h2>
          <ul>
            {LIST_ITEMS.map((item) => {
              return (
                <li key={item}>
                  <UserContentNavigationItem
                    title={item}
                    sectionChange={sectionContentHandler}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={classes["user--section"]}>
        <div className={classes["user--sectionsearch"]}>
          <button>Title [a-z]</button>
          <input
            type="text"
            placeholder="Search Integration"
            onChange={(event) => {
              setSearchedWord(event.target.value);
            }}
          />
        </div>
        <UserContentSection
          onIntegrationUpdate={props.onIntegrationUpdate}
          content={sectionContent}
          searchedWord={searchedWord}
        />
      </div>
    </main>
  );
};

export default UserContent;
