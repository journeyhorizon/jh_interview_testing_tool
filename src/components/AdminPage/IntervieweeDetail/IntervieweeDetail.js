import React from 'react';

class IntervieweeDetail extends React.Component {

  componentDidMount() {
    !sessionStorage.getItem("admin") && this.props.history.push("/admin");
  }

  render() {
    return (
      <h1>IntervieweeDetail</h1>
    )
  }
}

export default IntervieweeDetail;