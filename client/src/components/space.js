import Landing from "./landing";
import Sky from "./sky";
import React from "react";
import { Link } from "react-router-dom";
import StarArray from "./stars";
class space extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.location.state.date);
    console.log(props.location.state.apiResponse);

    this.state = { starArray: [] };
  }
  componentDidMount() {
    this.myRef = React.createRef();
  }
  //taken from: https://stackoverflow.com/questions/43441856/how-to-scroll-to-an-element
  scrollToMyRef = () => {
    window.scrollTo(0, this.myRef.current.offsetTop);
  };
  render() {
    return (
      <div className="space">
        <StarArray />
        <Landing date={this.props.location.state.date}></Landing>

        <Sky
          moon={this.props.location.state.apiResponse.moon}
          date={this.props.location.state.date}
        >
          {" "}
        </Sky>
      </div>
    );
  }
}
export default space;
