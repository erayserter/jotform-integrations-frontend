import React, { useEffect, useState } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";

import AppContainer from "./components/AppContainer";
import UserLogin from "./components/User/Authentication/UserLogin";

async function alreadyLoggedIn() {
  return fetch("https://b-ersoz.jotform.dev/intern-api/isLoggedIn").then(
    (res) => res.json()
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const asyncHandler = async () => {
      const res = await alreadyLoggedIn();
      if (res.content.responseCode === 200) setIsLoggedIn(true);
      else setIsLoggedIn(false);
    };
    asyncHandler();
  }, []);

  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;
