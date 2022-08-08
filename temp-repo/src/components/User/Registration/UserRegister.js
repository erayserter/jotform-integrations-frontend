import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import InputContainer from "../../UI/InputContainer";
import Navbar from "../../Navbar/Navbar";

import configurations from "../../../config/index";

import { useSelector } from "react-redux";

import IntegrationTitle from "../Integration/Header/IntegrationTitle";

async function registerUser(credentials) {
  return fetch(
    "https://" +
      configurations.DEV_RDS_NAME +
      ".jotform.dev/intern-api/register",
    {
      mode: "no-cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  ).then((data) => data.json());
}

const UserRegister = (props) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser({
      username: username,
      email: email,
      password: password,
    });
    if (res.responseCode === 200) {
      setIsRegistered(true);
    }
  };

  if (isRegistered)
    return (
      <Navigate
        to={{
          pathname: "/login",
        }}
      />
    );
  if (isLoggedIn)
    return (
      <Navigate
        to={{
          pathname: "/",
        }}
      />
    );

  return (
    <div className={` user-register h-100vh `}>
      <Navbar />
      <div
        className={` user-register__main flex justify-center max-w-3/4 m-auto `}
      >
        <div>
          <IntegrationTitle
            title={"Sign up"}
            subtitle={"Start automating your workflow."}
          />
          <form>
            <InputContainer
              inputLabel="Username"
              inputType="text"
              setter={(v) => {
                setUsername(v);
              }}
              labelClassName={`block mb-2 text-md font-semibold mt-10`}
              default={username}
            />
            <InputContainer
              inputLabel="Email"
              inputType="text"
              setter={(v) => {
                setEmail(v);
              }}
              labelClassName={`block mb-2 text-md font-semibold`}
              default={email}
            />
            <InputContainer
              inputLabel="Password"
              inputType="password"
              setter={(v) => {
                setPassword(v);
              }}
              labelClassName={`block mb-2 text-md font-semibold`}
              default={password}
            />
            <div className={` py-5 `}>
              <button
                className={` bg-green-400 w-full h-10 radius color-white hover:bg-green-500 text-sm `}
                onClick={handleSubmit}
              >
                Sign up
              </button>
              <p className={` text-center `}>
                Already have an account?{" "}
                <a href="./index.html#/login" className={` color-blue-400 `}>
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
