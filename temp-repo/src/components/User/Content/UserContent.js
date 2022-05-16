import React, { useState } from "react";

import classes from "./UserContent.module.css";
import UserContentNavigationItem from "./UserContentNavigationItem";

import UserContentSection from "./UserContentSection";

const LIST_ITEMS = [
  "All Integrations",
  "Templates",
  "Keys",
  "Favorites",
  "Trash",
];

const UserContent = (props) => {
  const [sectionContent, setSectionContent] = useState("All Integrations");

  const sectionContentHandler = (content) => {
    setSectionContent(content);
  };

  return (
    <main className={classes["user--main"]}>
      <div className={classes["user--navigation"]}>
        <div className={classes["user--sidebarbutton"]}>
          <button>Create New Integration</button>
        </div>
        <div className={classes["user--sidebarmenu"]}>
          <h2>My Integrations</h2>
          <ul>
            {LIST_ITEMS.map((item) => {
              return (
                <li key={item}>
                  <div className={classes["user--navigationitem"]}>
                    <UserContentNavigationItem
                      title={item}
                      sectionChange={sectionContentHandler}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={classes["user--section"]}>
        <div className={classes["user--sectionsearch"]}>
          <button>Sort by Title</button>
          <input type="text" placeholder="Search Integration" />
        </div>
        <UserContentSection content={sectionContent} />
      </div>
    </main>
  );
};

export default UserContent;
