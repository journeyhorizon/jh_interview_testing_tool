import React from "react";
import * as css from "./ControlPanel.module.scss";

// Components
import ControlPanelHandleButton from "../../../common/ControlPanelHandleButton/ControlPanelHandleButton";

class ControlPanel extends React.Component {
  render() {
    const testStorage = this.props.testStorage;
    const currentQA = this.props.currentQA;

    return (
      <div className={css.controlPanel}>
        <div className={css.countdownTimer}>
          <h3 className={css.countdownTimerTitle}>Countdown Timer</h3>
          <div className={css.countdownTimerDisplay}>
            <div className={css.timerCountingSet}>
              <div className={css.timerCountingSet_countingNumber}>{this.props.currentMinutes}</div>
              <p className={css.timerCountingSet_unit}>MINUTES</p>
            </div>
            <div className={css.gapBetweenTwoCountingNumber}>:</div>
            <div className={css.timerCountingSet}>
              <div className={css.timerCountingSet_countingNumber}>{this.props.currentSeconds}</div>
              <p className={css.timerCountingSet_unit}>SECONDS</p>
            </div>
          </div>
        </div>
        <div className={css.listQuestion}>
          <h3 className={css.listQuestionTitle}>List of Questions</h3>
          <div className={css.list}>
            {/* eslint-disable-next-line array-callback-return */}
            {testStorage.answerList && testStorage.answerList.map((result, index) => {
              if (result.answerContent === "" || result.answerContent.length === 0)
                return (<div key={result.id} className={`${css.item} ${currentQA.id === result.id ? css.currentItem : ""}`} onClick={() => this.props.changeCurrentQA(index)}>{result.id + 1}</div>)
            })}
          </div>
        </div>
        <div className={css.listQuestion}>
          <h3 className={css.listQuestionTitle}>List of Questions <span>(Answered)</span></h3>
          <div className={css.list}>
            {/* eslint-disable-next-line array-callback-return */}
            {testStorage.answerList && testStorage.answerList.map((result, index) => {
              if (result.answerContent !== "" && result.answerContent.length > 0)
                return <div key={result.id} className={`${css.item} ${currentQA.id === result.id ? css.currentItem : ""}`} onClick={() => this.props.changeCurrentQA(index)}>{result.id + 1}</div>
            })}
          </div>
        </div>
        <ControlPanelHandleButton handleClick={this.props.handleSubmit} typeOfHandleButton="Submit test" />
      </div>
    )
  }
}

export default ControlPanel;