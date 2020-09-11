import React from "react";

import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";

class AdminPage extends React.Component {
  render() {
    return (
      <>
        <Header name="Admin" />
        <div style={{ flexGrow: 1 }}>Admin Page</div>
        <Footer />
      </>
    )
  }
}

export default AdminPage;