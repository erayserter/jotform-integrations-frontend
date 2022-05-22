import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppContainer from "./components/AppContainer";
import UserLogin from "./components/User/Authentication/UserLogin";

function App() {
  const [isLogedIn, setIsLogedIn] = useState(true);

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
          element={<UserLogin isLogedIn={isLogedIn} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
