import React from "react";
import { Switch, Route } from "react-router-dom";

import HomePage from "./HomePage/HomePage";
import AdminPage from "./AdminPage/AdminPage";
import NotFoundPage from "./NotFoundPage/NotFoundPage";

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    )
  }
}

export default App;