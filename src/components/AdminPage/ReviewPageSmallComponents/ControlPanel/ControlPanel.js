import React from "react";
import * as css from "./ControlPanel.module.scss";

// Components
import ControlPanelHandleButton from "../../../common/ControlPanelHandleButton/ControlPanelHandleButton";

// Utils
import { formatTime } from "../../../../utils/formatTime";

class ControlPanel extends React.Component {
  render() {
    const resultOfTest = this.props.resultOfTest;
    const currentQA = this.props.currentQA;
    const detailInterviewee = this.props.detailInterviewee;

    return (
      <div className={css.controlPanel}>
        <div className={css.listQuestion}>
          <h3 className={css.listQuestionTitle}>List of Questions</h3>
          <div className={css.list}>
            {resultOfTest.answerList && resultOfTest.answerList.map((result, index) => (
              <div key={result.id} className={`${css.item} ${currentQA.id === result.id ? css.currentItem : ""}`} onClick={() => this.props.changeCurrentQA(index)}>{result.id + 1}</div>
            ))}
          </div>
        </div>
        <div className={css.timeDisplay}>
          <h3 className={css.timeDisplayTitle}>Time management</h3>
          <div className={css.timeDisplayContent}>
            <div className={css.submitTime}>Submit time: <span>{detailInterviewee && detailInterviewee.submitTime}</span></div>
            <div className={css.durationTime}>Duration time: <span>{formatTime(resultOfTest.completeDurationTime)}</span> (total: <span>{formatTime(resultOfTest.durationTime)}</span>)</div>
          </div>
        </div>
        <div className={css.reviews}>
          <h3 className={css.reviewsTitle}>Reviews</h3>
          <textarea className={css.reviewsContent} name="reviews" value={resultOfTest.reviews} placeholder={"Write down your reviews here..."} onChange={this.props.giveReviewsAndScores} />
        </div>
        <div className={css.scores}>
          <h3 className={css.scoresTitle}>Scores</h3>
          <input className={css.scoresValue} type="number" name="totalScore" step={0.1} min={0} max={10} value={resultOfTest.totalScore || 0} onChange={this.props.giveReviewsAndScores} disabled={this.props.disabledScoresInput ? "disabled" : ""} />
        </div>
        <ControlPanelHandleButton handleClick={this.props.saveChanges} typeOfHandleButton="Save changes" />
      </div>
    )
  }
}

export default ControlPanel;