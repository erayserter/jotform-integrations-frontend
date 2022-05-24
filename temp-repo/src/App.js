import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppContainer from "./components/AppContainer";
import UserLogin from "./components/User/Authentication/UserLogin";

async function alreadyLoggedIn() {
  return await fetch("https://b-ersoz.jotform.dev/intern-api/isLoggedIn").then(
    (data) => data.json()
  );
}

function App() {
  const [isLogedIn, setIsLogedIn] = useState(false);

  useEffect(() => {
    const res = alreadyLoggedIn().then((value) => {
      // console.log(value);
      // if (value.content.status > 0) setIsLogedIn(true);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<AppContainer isLogedIn={isLogedIn} />}
        ></Route>
        <Route
          exact
          path="login"
          element={<UserLogin isLogedIn={isLogedIn} onSignIn={setIsLogedIn} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
