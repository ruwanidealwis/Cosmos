import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import landing from "./components/landing";
import home from "./components/home";
import Navbar from "./components/navigation";
import { Route, BrowserRouter, Redirect, useHistory } from "react-router-dom";

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { date: "", apiResponse: "" }; //d
  }
  render() {
    return (
      <div className="AppFrontPage">
        <BrowserRouter>
          <div className="App">
            <Route exact path="/" component={home} />
            <Route path="/space/" component={landing} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default Home;
