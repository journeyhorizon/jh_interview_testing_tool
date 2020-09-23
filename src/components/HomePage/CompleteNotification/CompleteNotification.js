import React from "react";
import { Link } from "react-router-dom";
import * as css from "./CompleteNotification.module.scss";

// Assets
import logoColor from "../../../assets/logo-color.png";

class CompleteNotification extends React.Component {
  constructor() {
    super();

    this.state = {
      isTestCompleted: false
    }
  }
  componentDidMount() {
    if (!localStorage.getItem("interviewee") || !localStorage.getItem("result"))
      this.props.history.push("/testlist");
    else {
      this.setState({ isTestCompleted: true });
      console.log(JSON.parse(localStorage.getItem("result")));
      console.log("Call API for saving interviewee and its result into database");
    }
  }

  componentWillUnmount() {
    this.state.isTestCompleted && localStorage.clear();
  }

  render() {
    return (
      <div className={css.container}>
        <Link to="/" className={css.link}>
          <img className={css.titleImage} src={logoColor} alt="logo-company" />
        </Link>
        <h1 className={css.message}>You have done the Interview Testing!</h1>
        <p className={css.message}>Congratulating! See you again!</p>
      </div>
    )
  }
}

export default CompleteNotification;