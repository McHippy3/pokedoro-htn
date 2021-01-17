import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

import { isloggedIn } from "./utils/auth";

import "./App.css";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route  exact path="/"
          render={() => isloggedIn() ? <Dashboard /> : <Login />}
        />
        <Route exact path="/dashboard"
          render={() => isloggedIn() ? <Dashboard /> : <Login />}
        />
      </Switch>
    </Router>
  )
}

export default App;
