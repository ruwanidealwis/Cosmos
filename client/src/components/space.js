import Landing from "./landing";
import React from "react";
class space extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = { starArray: [] };
  }

  render() {
    return <Landing date={this.props.location.state.date}></Landing>;
  }
}
export default space;
