import React, { useState } from "react";

import classes from "./UserLogin.module.css";

import InputContainer from "./InputContainer";
import Navbar from "../../Navbar/Navbar";

const UserLogin = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const clickHandler = (event) => {
    event.preventDefault();
    console.log(username);
    console.log(password);
  };

  return (
    <div className={classes["container"]}>
      <Navbar />
      <div className={classes["userLogin--container"]}>
        <div className={classes["userLogin--wrapper"]}>
          <h1 className={classes["userLogin--header"]}>Welcome Back!</h1>
          <form>
            <InputContainer
              inputLabel="Username"
              inputType="text"
              setter={setUsername}
            />
            <InputContainer
              inputLabel="Password"
              inputType="password"
              setter={setPassword}
            />
            <button onClick={clickHandler}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
