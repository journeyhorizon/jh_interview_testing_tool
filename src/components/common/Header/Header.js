import React from "react";
import * as css from "./Header.module.scss";

class Header extends React.Component {
  render() {
    if (this.props.isNotFound)
      return (
        <div className={css.header}>
          <div className={css.headerTitle}>
            <span>Not Found</span>
          </div>
        </div>
      );
    else
      return (
        <div className={css.header}>
          <div className={css.headerTitle}>
            Welcome&nbsp;<span>{this.props.name}</span>!
          </div>
        </div>
      );
  }
}

export default Header;