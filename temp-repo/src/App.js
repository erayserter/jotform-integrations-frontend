import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import UserContent from "./components/User/Content/UserContent";

function App() {
  return (
    <Router>
      <Navbar />
      <UserContent />
    </Router>
  );
}

export default App;
