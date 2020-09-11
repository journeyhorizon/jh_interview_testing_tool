import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import * as css from "./AdminPage.module.scss";

import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";
import Login from "./Login/Login";
import IntervieweeList from "./IntervieweeList/IntervieweeList";
import IntervieweeDetail from "./IntervieweeDetail/IntervieweeDetail";
import ReviewPageOfLogicTest from "./ReviewPageOfLogicTest/ReviewPageOfLogicTest";
import ReviewPageOfEnglishTest from "./ReviewPageOfEnglishTest/ReviewPageOfEnglishTest";

class AdminPage extends React.Component {
  render() {
    return (
      <>
        <Header name="Admin" />
        <div className={css.container}>
          <Switch>
            <Route path="/admin" component={Login} />
            <Route path="/admin/intervieweelist" component={IntervieweeList} />
            <Route exact path="/admin/interviewee/:fullname" component={IntervieweeDetail} />
            <Route path="/admin/interviewee/:fullname/logictest" component={ReviewPageOfLogicTest} />
            <Route path="/admin/interviewee/:fullname/englishtest" component={ReviewPageOfEnglishTest} />
            <Redirect from="/admin/*" to="/adminnotfound" />
          </Switch>
        </div>
        <Footer />
      </>
    )
  }
}

export default AdminPage;