import React from "react";
import * as css from "./MobileNavbar.module.scss";

// Assets
import menu from "../../../assets/icons/menu.png";

const MobileNavbar = (props) => {
  return (
    <div className={css.mobileNavbar}>
      <div className={css.menuButton} onClick={props.showMenuBar}>
        <img src={menu} alt="menu" />
      </div>
      <div className={css.orderOfCurrentPage}><span>{props.currentQA.id + 1 || 0}</span>/{props.storage.answerList && props.storage.answerList.length}</div>
    </div>
  )
}

export default MobileNavbar;