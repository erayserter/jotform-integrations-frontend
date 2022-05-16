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
  const [sectionContent, setSectionContent] = useState("all_integrations");

  const sectionContentHandler = (content) => {
    setSectionContent(content);
  };

  return (
    <main>
      <div className={classes["user--navigation"]}>
        <button>CREATE NEW INTEGRATION</button>
        <h2>My Integrations</h2>
        <ul>
          {LIST_ITEMS.map((item) => {
            return (
              <li>
                <UserContentNavigationItem
                  title={item}
                  sectionChange={sectionContentHandler}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className={classes["user--section"]}>
        <button>Sort by Title</button>
        <input type="text" placeholder="Search in My Integrations" />
        <UserContentSection content={sectionContent} />
      </div>
    </main>
  );
};

export default UserContent;
