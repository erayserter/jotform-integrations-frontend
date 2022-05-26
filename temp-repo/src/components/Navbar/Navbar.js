import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import classes from "./Navbar.module.css";

function Navbar(props) {
  return (
    <header className={classes["navbar"]}>
      <div className={classes["navbar--logo"]}>
        <Link to="/">
          <img
            src="https://www.jotform.com/resources/assets/svg/jotform-icon-dark.svg"
            alt="Logo"
            height="70"
          />
        </Link>
      </div>
      <div className={classes["navbar--navigation"]}>
        <ul>
          <li>All Integrations</li>
          <li>Login</li>
          <li>Logout</li>
        </ul>
      </div>
      <div className={classes["navbar--profile"]}>
        <img
          src="https://pbs.twimg.com/profile_images/1143923112389632002/FZdo7wSi_400x400.png"
          alt="User Image"
          height="50"
        />
      </div>
    </header>
  );
}

export default Navbar;
