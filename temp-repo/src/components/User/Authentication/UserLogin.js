import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import classes from "./UserLogin.module.css";

import InputContainer from "../../UI/InputContainer";
import Navbar from "../../Navbar/Navbar";

async function loginUser(credentials) {
  return fetch("https://b-ersoz.jotform.dev/intern-api/login", {
    mode: "no-cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}

const UserLogin = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser({
      login_info: username,
      password: password,
    });
    console.log(res);
    // if (res.content.status == 1) {
    //   props.onSignIn(true);
    // }
  };

  if (props.isLoggedIn)
    return (
      <Navigate
        to={{
          pathname: "/",
        }}
      />
    );

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
              setter={(v) => {
                setUsername(v);
              }}
              default={username}
            />
            <InputContainer
              inputLabel="Password"
              inputType="password"
              setter={(v) => {
                setPassword(v);
              }}
              default={password}
            />
            <button onClick={handleSubmit}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
