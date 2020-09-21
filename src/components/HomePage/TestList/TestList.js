import React from "react";

class TestList extends React.Component {
  componentDidMount() {
    !localStorage.getItem("interviewee") && this.props.history.push("/");
  }

  render() {
    return (
      <h1>TestList</h1>
    )
  }
}

export default TestList;