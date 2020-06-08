import React from "react";
import moment from "moment";
import "./styles/sky.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ReactComponent as Mountain } from "./images/mountains.svg";
import StarArray from "./stars";
const convertToDate = date => {
  console.log(date);
  let myDate = moment(date);
  console.log(myDate.format("LL"));
  return myDate.format("LL");
};

const moonPhase = phaseNum => {
  if (phaseNum == 0) {
    return "New Moon";
  } else if (phaseNum < 0.22) {
    return "Waxing Cresent";
  } else if (phaseNum <= 0.25) {
    return "First Quarter";
  } else if (phaseNum < 0.47) {
    return "Waxing Gibbous";
  } else if (phaseNum <= 0.5) {
    return "Full Moon";
  } else if (phaseNum < 0.73) {
    return "Waning Gibbous";
  } else if (phaseNum <= 0.75) {
    return "Last Quarter";
  } else if (phaseNum < 0.97) {
    return "Waning Crescent";
  } else {
    return "New Moon";
  }
};

const sky = ({ moon, date }) => {
  console.log(date);
  console.log(StarArray);
  console.log(date);
  return (
    <div className="moon">
      <Row>
        <Col>
          <div className="Image">
            <Mountain className="Mountain" />
          </div>
        </Col>
        <Col>
          <div className="moonInfo">
            <p>
              On {convertToDate(date)} the moon was a {moonPhase(moon.phase)}{" "}
              with an illumination of{" "}
              {Math.round(moon.illuminationFraction * 100)}%
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default sky;
//
