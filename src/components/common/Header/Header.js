import React from "react";
import * as css from "./Header.module.scss";

const Header = (props) => {
  if (props.isNotFound)
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
          Welcome&nbsp;<span>{props.name}</span>!
          </div>
      </div>
    );
}

export default Header;