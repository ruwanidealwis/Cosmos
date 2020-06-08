import React from "react";
import "../App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
//import landing from "/landing";
import { Route, BrowserRouter, Redirect, useHistory } from "react-router-dom";
import Axios from "axios";

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { date: "", apiResponse: "", starArray: [] }; //d

    this.handleChange = this.handleChange.bind(this);
    this.sendAPIRequest = this.sendAPIRequest.bind(this);
  }

  handleChange(event) {
    this.setState({ date: event.target.value });
    console.log(this.state.date);
    console.log("hi");
  }

  sendAPIRequest(event) {
    event.preventDefault();
    axios.get(`http://localhost:8000/space/${this.state.date}`).then(res => {
      console.log(res.data);
      this.setState({ apiResponse: res.data });
      console.log("hi");
      console.log(this.state.apiResponse);
      //console.log(this.state.context);
      this.props.history.push({
        pathname: `/space/`,
        state: {
          apiResponse: this.state.apiResponse,
          date: this.state.date
        }
      });

      //return <Redirect to="/space/" />;
      //history.push("/space/");
      //event.preventDefault();
    });
  }

  callAPI() {
    fetch("http://localhost:8000/")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }))
      .catch(err => err);
  }
  //componentDidMount() {
  // this.callAPI();
  //}
  render() {
    const newSmallStar = () => {
      return (
        <div
          className="star"
          style={{
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            width: "1.5px",
            height: "1.5px"
          }}
        ></div>
      );
    };
    const newLargeStar = () => {
      return (
        <div
          className="star animate"
          style={{
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            width: "3.3px",
            height: "3.3px"
          }}
        ></div>
      );
    };

    const createLargeStar = () => {
      for (let i = 0; i <= 130; i++) {
        let star = newLargeStar();

        this.state.starArray.push(star);
      }
    };

    const createSmallStar = () => {
      for (let i = 0; i <= 170; i++) {
        let star = newSmallStar();
        //console.log(star);
        this.state.starArray.push(star);
      }
    };

    createLargeStar();
    createSmallStar();
    return (
      <div className="AppFrontPage">
        {this.state.starArray}

        <header className="App-header">
          <h1 className="App-title"> What were the Cosmos Doing? </h1>
        </header>
        <p className="App-Description">
          <strong>
            Find out all the magnificent things that happened in space on your
            birthday!<br></br> Developed using the NASA API
          </strong>
        </p>
        <br></br>
        <br></br>
        <form className="user-info" onSubmit={this.sendAPIRequest}>
          <input
            className="enter-date"
            type="date"
            value={this.state.date}
            onChange={this.handleChange}
          ></input>
          <br></br>
          <br></br>
          <input
            className="SubmitButton"
            type="submit"
            value="Let's Find Out"
          ></input>
        </form>
      </div>
    );
  }
}

export default App;
