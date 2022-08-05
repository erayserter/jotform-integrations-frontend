import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import InputContainer from "../../UI/InputContainer";
import Navbar from "../../Navbar/Navbar";

import configurations from "../../../config/index";

import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn } from "../../../store/user";
import IntegrationTitle from "../Integration/Header/IntegrationTitle";

async function loginUser(credentials) {
  return fetch(
    "https://" + configurations.DEV_RDS_NAME + ".jotform.dev/intern-api/login",
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

const UserLogin = (props) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser({
      login_info: username,
      password: password,
    });
    if (res.responseCode === 200) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }));
    }
  };

  if (isLoggedIn)
    return (
      <Navigate
        to={{
          pathname: "/",
        }}
      />
    );

  return (
    <div className={` user-login h-100vh `}>
      <Navbar />
      <div
        className={` user-login__main flex justify-center max-w-3/4 m-auto `}
      >
        <div>
          <IntegrationTitle
            title={"Welcome Back!"}
            subtitle={"Workflow automation for everyone."}
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
              inputLabel="Password"
              inputType="password"
              setter={(v) => {
                setPassword(v);
              }}
              labelClassName={` block mb-2 text-md font-semibold `}
              default={password}
            />
            <div className={` py-5 `}>
              <button
                className={` bg-green-400 w-full h-10 radius color-white hover:bg-green-500 text-sm `}
                onClick={handleSubmit}
              >
                Log in
              </button>
              <p className={` text-center `}>
                Don’t have an account?{" "}
                <a href="/register" className={` color-blue-400 `}>
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
