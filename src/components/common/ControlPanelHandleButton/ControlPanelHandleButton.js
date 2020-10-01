import React from "react";
import * as css from "./ControlPanelHandleButton.module.scss";

const ControlPanelHandleButton = (props) => {
  return (
    <div className={css.handleButton} onClick={() => props.handleClick()}>
      <h3 className={css.buttonTitle}>{props.typeOfHandleButton}</h3>
    </div>
  )
}

export default ControlPanelHandleButton;