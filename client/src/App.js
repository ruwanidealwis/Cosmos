import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import space from "./components/space";
import home from "./components/home";

import { Route, BrowserRouter, Redirect, useHistory } from "react-router-dom";

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { date: "", apiResponse: "" }; //d
  }
  render() {
    return (
      <BrowserRouter>
        <Route exact path="/" component={home} />
        <Route exact path="/space/" component={space} />
      </BrowserRouter>
    );
  }
}

export default Home;
