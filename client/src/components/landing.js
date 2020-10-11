import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import "./styles/landing.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import StarArray from "./stars";
import { ReactComponent as Planet } from "./images/planet.svg";

const convertToDate = (date) => {
  let myDate = moment(date);
  return myDate.format("LL");
};

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="info">
        <Row>
          <Col>
            <h1 className="date">
              <strong>{convertToDate(this.props.date)}</strong>
            </h1>
            <br></br>
            <br></br>
            <h5 className="subInfo">Oi! A wonderful choice!</h5>
            <h5 className="subInfo">
              Take a journey through space to discover what the universe was up
              to...
              <br></br>
              <br></br>
              <p>I want to explort!</p>
              <br></br>
              <Button
                variant="link"
                onClick={this.props.handleScroll}
                className="subInfo"
              >
                ↓
              </Button>
            </h5>
          </Col>
          <Col>
            <Planet className="image" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Landing;
