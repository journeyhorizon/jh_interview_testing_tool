import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import * as css from "./HomePage.module.scss";

// Components
import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";
import Welcome from "./Welcome/Welcome";
import TestList from "./TestList/TestList";
import TestDetail from "./TestDetail/TestDetail";
import CompleteNotification from "./CompleteNotification/CompleteNotification";

class HomePage extends React.Component {
  render() {
    return (
      <>
        <Header name="Interviewee" />
        <div className={css.container}>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route path="/testlist" component={TestList} />
            <Route path="/test/logictest" component={TestDetail} />
            <Route path="/test/englishtest" component={TestDetail} />
            <Route path="/complete" component={CompleteNotification} />
            <Redirect to="/notfound" />
          </Switch>
        </div>
        <Footer />
      </>
    )
  }
}

export default HomePage;