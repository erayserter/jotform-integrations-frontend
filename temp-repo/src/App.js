import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";

import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
    </Router>
  );
}

export default App;
