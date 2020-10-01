import React from "react";
import { Switch, Route } from "react-router-dom";

// Component
import HomePage from "./HomePage/HomePage";
import AdminPage from "./AdminPage/AdminPage";
import NotFoundPage from "./NotFoundPage/NotFoundPage";

const App = () => {
  return (
    <Switch>
      <Route path="/adminnotfound" component={NotFoundPage} />
      <Route path="/notfound" component={NotFoundPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  )
}

export default App;