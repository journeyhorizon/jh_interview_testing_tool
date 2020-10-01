import React from "react";
import * as css from "./ControlPanel.module.scss";

// Components
import ControlPanelHandleButton from "../../../common/ControlPanelHandleButton/ControlPanelHandleButton";
import CountdownTimer from "./CountdownTimer/CountdownTimer";
import ListQuestion from "./ListQuestion/ListQuestion";

const ControlPanel = (props) => {
  return (
    <div className={css.controlPanel}>
      <CountdownTimer />
      <ListQuestion />
      <ControlPanelHandleButton handleClick={props.handleSubmit} typeOfHandleButton="Submit test" />
    </div>
  )
}

export default ControlPanel;