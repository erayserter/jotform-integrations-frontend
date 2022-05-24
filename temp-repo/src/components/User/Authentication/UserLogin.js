import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import classes from "./UserLogin.module.css";

import InputContainer from "./InputContainer";
import Navbar from "../../Navbar/Navbar";

async function loginUser(credentials) {
  return fetch("https://b-ersoz.jotform.dev/intern-api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
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
    if (res.content.status == 1) {
      props.onSignIn(true);
      // console.log(res);
    }
  };

  if (props.isLogedIn)
    return (
      <Navigate
        to={{
          pathname: "/",
          state: {
            from: props.location,
          },
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
              setter={setUsername}
            />
            <InputContainer
              inputLabel="Password"
              inputType="password"
              setter={setPassword}
            />
            <button onClick={handleSubmit}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
