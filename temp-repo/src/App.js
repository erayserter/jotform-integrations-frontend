import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppContainer from "./components/AppContainer";
import UserLogin from "./components/User/Authentication/UserLogin";

async function alreadyLoggedIn() {
  return fetch("http://b-ersoz.jotform.dev/intern-api/isLoggedIn").then((res) =>
    res.json()
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const asyncHandler = async () => {
      const res = await alreadyLoggedIn();
      console.log(res);
    };
    asyncHandler();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<AppContainer isLoggedIn={isLoggedIn} />}
        ></Route>
        <Route
          exact
          path="login"
          element={
            <UserLogin isLoggedIn={isLoggedIn} onSignIn={setIsLoggedIn} />
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
