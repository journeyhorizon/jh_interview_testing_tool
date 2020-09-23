import React from "react";
import * as css from "./ControlPanelHandleButton.module.scss";

class ControlPanelHandleButton extends React.Component {
  render() {
    return (
      <div className={css.handleButton} onClick={this.props.handleClick}>
        <h3 className={css.buttonTitle}>{this.props.typeOfHandleButton}</h3>
      </div>
    )
  }
}

export default ControlPanelHandleButton;