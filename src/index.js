import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

// import App from "./components/App";
import Header from "./components/common/Header/Header"
import Footer from "./components/common/Footer/Footer"

ReactDOM.render(
  <Router>
    <Header />
    <Footer />
  </Router>,
  document.getElementById("root")
);
