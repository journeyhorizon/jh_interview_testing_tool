import React from "react";
import * as css from "./Header.module.scss";

class Header extends React.Component {
  render() {
    if (this.props.isNotFound)
      return (
        <div className={css.header}> <span>Not Found</span> </div>
      );
    else
      return (
        <div className={css.header}> Welcome&nbsp;<span>{this.props.name}</span> </div>
      );
  }
}

export default Header;