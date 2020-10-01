import React from "react";
import { Link } from "react-router-dom";
import * as css from "./NotFoundPage.module.scss";

// Component
import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";

// Assets
import notFoundImage from "../../assets/notFoundImage.png";

const NotFoundPage = (props) => {
  return (
    <>
      <Header isNotFound={true} />
      <div className={css.container}>
        <img className={css.descriptiveImage} src={notFoundImage} alt="background" />
        <h1>Whoops!</h1>
        <p>We can't seem to find the page that you're looking for</p>
        <p>
          Return to&nbsp;
            {props.location.pathname === "/adminnotfound" ? <Link to="/admin"><span>Admin Page</span></Link> : <Link to="/"><span>Home Page</span></Link>}
        </p>
      </div>
      <Footer />
    </>
  )
}

export default NotFoundPage;