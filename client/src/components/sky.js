import React from "react";
import moment from "moment";
import "./styles/sky.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ReactComponent as Mountain } from "./images/mountainV5.svg";
import { ReactComponent as newMoon } from "./images/newMoon.svg";
import { ReactComponent as WaxingCresent } from "./images/waxingCresent.svg";
import { ReactComponent as WaningCresent } from "./images/waningCresent.svg";
import { ReactComponent as FirstQuarter } from "./images/firstQuarter.svg";
import { ReactComponent as ThirdQuarter } from "./images/thirdQuarter.svg";
import { ReactComponent as FullMoon } from "./images/fullMoon.svg";
import { ReactComponent as Tide } from "./images/seaNormalTide.svg";
import { ReactComponent as SpaceShip } from "./images/spaceShip.svg";
import getDisplayName from "react-display-name";
import { Spring, animated, config } from "react-spring/renderprops";
import Typist from "react-typist";
//import Tide from "./moonAnimation";

import { MorphReplace } from "react-svg-morph";
import StarArray from "./stars";
var MoonComponent = null;
const convertToDate = (date) => {
  console.log(date);
  let myDate = moment(date);
  console.log(myDate.format("LL"));
  return myDate.format("LL");
};

const moonPhase = (phaseNum) => {
  console.log(MoonComponent);
  if (phaseNum == 0) {
    return "New Moon";
  } else if (phaseNum < 0.22) {
    MoonComponent = React.lazy(() => import("./images/waxingCresent.svg"));
    return "Waxing Cresent";
  } else if (phaseNum <= 0.25) {
    return "First Quarter";
  } else if (phaseNum < 0.47) {
    return "Waxing Gibbous";
  } else if (phaseNum <= 0.5) {
    MoonComponent = React.lazy(() => import("./landing"));
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

class Sky extends React.Component {
  componentDidUpdate() {
    console.log(this.state);
    console.log(this.props);
  }

  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date,
      moon: this.props.moon,
      inView: this.props.inView,
      moonSVG: [WaningCresent, WaxingCresent, FullMoon],
      renderMsg: false,
    };

    console.log(this.state.inView);
  }
  onHeaderTyped = () => {
    this.setState({ renderMsg: true });
  };

  //TODO  make all heights 80%
  //TODO remove bumps from mooon
  //TODO figure out horizontal space in mobile

  //typing adapted from: https://github.com/jstejada/react-typist/blob/d067d1a0a357ac221ddb83efe4e0d9719a39c672/examples/index.js
  render() {
    let { date, moon, moonSVG } = this.state;
    console.log(this.props.inView);

    console.log(Math.round(moon.illuminationFraction * 100));

    let moonPhaseVal = moonPhase(moon.phase);
    return (
      <div className="moon">
        <Row className="rowClass">
          <Col>
            <div className="shootingStar"></div>

            <div className="Image">
              {this.props.inView ? (
                moonPhaseVal === "Full Moon" ? (
                  <FullMoon className="moonSvg"></FullMoon>
                ) : moonPhaseVal === "Waxing Cresent" ? (
                  <WaxingCresent className="moonSvg"></WaxingCresent>
                ) : moonPhaseVal === "Waning Cresent" ? (
                  <WaningCresent className="moonSvg"></WaningCresent>
                ) : null
              ) : null}
              <SpaceShip className="spaceship"></SpaceShip>
            </div>
          </Col>
          <Col>
            <div className="moonInfo">
              <h4>
                {this.props.inView ? (
                  <div>
                    <Typist
                      className="infoTitle"
                      onTypingDone={this.onHeaderTyped}
                      cursor={{ hideWhenDone: true }}
                    >
                      Space Report: The Moon <br />
                      -----------------------------
                    </Typist>
                    {this.state.renderMsg ? (
                      <Typist
                        className="infoSubText"
                        cursor={{ hideWhenDone: true }}
                      >
                        <Typist.Delay ms={500} />→ Date: {date}
                        <br />
                        <Typist.Delay ms={500} />→ Phase:{" "}
                        {moonPhase(moon.phase)}
                        <br />
                        <Typist.Delay ms={500} />
                        →Illumination:
                        {Math.round(moon.illuminationFraction * 100).toString(
                          10
                        )}
                        %
                        <br />
                        <Typist.Delay ms={500} />
                        →Tides:
                        {Math.round(moon.illuminationFraction * 100).toString(
                          10
                        )}
                        %
                        <br />
                      </Typist>
                    ) : null}
                  </div>
                ) : null}
              </h4>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Sky;
/*On {convertToDate(date)} the moon was a {moonPhase(moon.phase)}{" "}
                with an illumination of{" "}
                {Math.round(moon.illuminationFraction * 100)}%*/
