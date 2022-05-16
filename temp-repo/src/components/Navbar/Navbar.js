import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import classes from "./Navbar.module.css";

function Navbar(props) {
  return (
    <header className={classes["navbar"]}>
      <div className={classes["navbar--logo"]}>
        <Link to="/">
          <img src="" alt="Logo" height={167} />
        </Link>
      </div>
      <div className={classes["navbar--navigation"]}>
        <ul>
          <li>list-item-1</li>
          <li>list-item-2</li>
          <li>list-item-3</li>
        </ul>
      </div>
      <div className={classes["navbar--profile"]}>
        <img src="" alt="User Image" />
      </div>
    </header>
  );
}

export default Navbar;
