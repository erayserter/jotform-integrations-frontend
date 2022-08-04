import React, { useEffect } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";

import AppContainer from "./components/AppContainer";
import UserLogin from "./components/User/Authentication/UserLogin";

import configurations from "./config/index";

import { useDispatch } from "react-redux";
import { setIsLoggedIn } from "./store/user";

async function alreadyLoggedIn() {
  return fetch(
    "https://" +
      configurations.DEV_RDS_NAME +
      ".jotform.dev/intern-api/isLoggedIn"
  ).then((res) => res.json());
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const asyncHandler = async () => {
      const res = await alreadyLoggedIn();
      if (res.responseCode === 200)
        dispatch(setIsLoggedIn({ isLoggedIn: true }));
      else dispatch(setIsLoggedIn({ isLoggedIn: false }));
    };
    asyncHandler();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<AppContainer />}></Route>
        <Route exact path="login" element={<UserLogin />}></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
