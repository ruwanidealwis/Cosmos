import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import "./styles/landing.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import StarArray from "./stars";
import { ReactComponent as Planet } from "./images/planet.svg";

const convertToDate = date => {
  let myDate = moment(date);
  return myDate.format("LL");
};

const landing = ({ date, link }) => {
  console.log(StarArray);
  return (
    <div className="info">
      <Row>
        <Col>
          <h1 className="date">
            <strong>{convertToDate(date)}</strong>
          </h1>
          <br></br>
          <br></br>
          <h5 className="subInfo">
            A Great choice for a date if I do say so myself!
          </h5>
          <h5 className="subInfo">
            While I don't know what you were doing on that fine night, I can
            tell you a little more about what the world was up to!
            <br></br>
            <br></br>
            <p>I want to learn more!</p>
            <br></br>
            <Link id="nextItemVV" className="subInfo">
              ↓
            </Link>
          </h5>
        </Col>
        <Col>
          <Planet className="image" />
        </Col>
      </Row>
    </div>
  );
};

export default landing;
