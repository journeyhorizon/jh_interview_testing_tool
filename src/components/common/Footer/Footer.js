import React from "react";
import * as css from "./Footer.module.scss";

class Footer extends React.Component {
  render() {
    return (
      <div className={css.footer}>
        <div className={css.footerTitle}>
          Journey Horizon
        </div>
      </div>
    )
  }
}

export default Footer;