import React from "react";

import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";

class NotFoundPage extends React.Component {
  render() {
    return (
      <>
        <Header />
        <div style={{ flexGrow: 1, backgroundColor: "lightblue" }}>Not Found Page</div>
        <Footer />
      </>
    )
  }
}

export default NotFoundPage;