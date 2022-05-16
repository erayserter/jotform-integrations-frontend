import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AppContainer from "./components/AppContainer";

import Navbar from "./components/Navbar/Navbar";

import UserContent from "./components/User/Content/UserContent";

function App() {
  return (
    <Router>
      <AppContainer />
    </Router>
  );
}

export default App;
