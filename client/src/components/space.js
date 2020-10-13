import Landing from "./landing";
import Sky from "./sky";
import React from "react";
import { Link } from "react-router-dom";
import StarArray from "./stars";
import Scroll from "react-scroll";
import "./styles/space.css";
// Somewhere else, even another file
var Element = Scroll.Element;
var scroller = Scroll.scroller;

class Space extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.location.state.date);
    console.log(props.location.state.apiResponse);
    this.state = {
      date: props.location.state.date,
    };

    this.section1 = React.createRef();

    this.state = { starArray: [], inView: false };
    this.scrollToMyRef = this.scrollToMyRef.bind(this);
  }
  scrollToMyRef = () => {
    this.setState(
      {
        section1inView: true,
      },
      () => console.log(this.state)
    );
    console.log(this.section1);
    scroller.scrollTo("firstSection", {
      duration: 1500,
      delay: 100,
      smooth: true,

      offset: 30, // Scrolls to element + 50 pixels down the page
    });
    console.log("scroll");
    console.log(this.state);
  };
  //window.scrollTo(0, this.section1.current.offsetTop);

  //taken from: https://stackoverflow.com/questions/43441856/how-to-scroll-to-an-element

  render() {
    return (
      <div className="space">
        <StarArray />
        <Landing
          date={this.props.location.state.date}
          handleScroll={this.scrollToMyRef}
        ></Landing>
        <div id="skyInfo">
          <Element name="firstSection">
            <Sky
              ref={this.section1}
              moon={this.props.location.state.apiResponse.moon}
              date={this.props.location.state.date}
              inView={this.state.Section1inView}
            ></Sky>
          </Element>

          <Element name="secondSection">
            <Asteroid
              asteroids={this.props.location.state.apiResponse.asteroids}
              date={this.props.location.state.date}
              inView={this.state.section2inView}
            ></Asteroid>
          </Element>
        </div>
      </div>
    );
  }
}
export default Space;
