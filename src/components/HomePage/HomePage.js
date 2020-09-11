import React from "react";

import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";

class HomePage extends React.Component {
  render() {
    return (
      <>
        <Header />
        <div style={{ flexGrow: 1 }}>Home Page</div>
        <Footer />
      </>
    )
  }
}

export default HomePage;