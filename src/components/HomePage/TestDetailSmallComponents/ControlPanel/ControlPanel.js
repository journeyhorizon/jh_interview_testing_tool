import React from "react";
import * as css from "./ControlPanel.module.scss";

// Components
import ControlPanelHandleButton from "../../../common/ControlPanelHandleButton/ControlPanelHandleButton";
import CountdownTimer from "./CountdownTimer/CountdownTimer";
import ListQuestion from "./ListQuestion/ListQuestion";

class ControlPanel extends React.Component {
  render() {
    return (
      <div className={css.controlPanel}>
        <CountdownTimer
          currentMinutes={this.props.currentMinutes}
          currentSeconds={this.props.currentSeconds}
        />
        <ListQuestion
          testStorage={this.props.testStorage}
          currentQA={this.props.currentQA}
          changeCurrentQA={this.props.changeCurrentQA}
          isBigScreen={this.props.isBigScreen}
        />
        <ControlPanelHandleButton handleClick={this.props.handleSubmit} typeOfHandleButton="Submit test" />
      </div>
    )
  }
}

export default ControlPanel;