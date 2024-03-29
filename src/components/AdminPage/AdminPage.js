import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import * as css from "./AdminPage.module.scss";
import AuthProvider from "../../context/AuthContext";
// Components
import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import IntervieweeList from "./IntervieweeList/IntervieweeList";
import IntervieweeDetail from "./IntervieweeDetail/IntervieweeDetail";
import ReviewPageOfTest from "./ReviewPageOfTest/ReviewPageOfTest";

const AdminPage = () => {
  return (
    <>
      <AuthProvider>
        <Header name="Admin" />
        <div className={css.container}>
          <Switch>
            <Route exact path="/admin" component={Login} />
            <Route exact path="/admin/dashboard" component={Dashboard} />
            <Route
              exact
              path="/admin/intervieweelist"
              component={IntervieweeList}
            />
            <Route
              exact
              path="/admin/interviewee/:id/:fullname"
              component={IntervieweeDetail}
            />
            <Route
              path="/admin/interviewee/:id/:fullname/logictest"
              component={ReviewPageOfTest}
            />
            <Route
              path="/admin/interviewee/:id/:fullname/englishtest"
              component={ReviewPageOfTest}
            />
            <Redirect to="/adminnotfound" />
          </Switch>
        </div>
        <Footer />
      </AuthProvider>
    </>
  );
};

export default AdminPage;
