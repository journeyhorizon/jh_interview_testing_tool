import React from "react";
import { Link } from "react-router-dom";
import * as css from "./CompleteNotification.module.scss";

// Api
import myApi from "../../../api/myApi";

// Assets
import logoColor from "../../../assets/logo-color.png";

class CompleteNotification extends React.Component {
  async componentDidMount() {
    if (!localStorage.getItem("interviewee") || !localStorage.getItem("result"))
      this.props.history.push("/");
    else {
      const newInterviewee = JSON.parse(localStorage.getItem("interviewee"));
      const newResult = JSON.parse(localStorage.getItem("result"));

      await myApi().post("/interviewee/saveIntervieweeRecord", newInterviewee);
      await myApi().post("/interviewee/saveTestRecord", newResult);
      localStorage.clear();
    }
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