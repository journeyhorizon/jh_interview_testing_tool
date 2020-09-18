import React from "react";
import * as css from "./ControlPanel.module.scss";

// Utils
import { formatTime } from "../../../../utils/formatTime";

class ControlPanel extends React.Component {
  render() {
    return (
      <div className={css.controlPanel}>
        <div className={css.listQuestion}>
          <h3 className={css.listQuestionTitle}>List of Questions</h3>
          <div className={css.list}>
            {this.props.resultOfEnglishTest.answerList && this.props.resultOfEnglishTest.answerList.map((result, index) => (
              <div key={result.id} className={`${css.item} ${this.props.currentQA.id === result.id ? css.currentItem : ""}`} onClick={() => this.props.changeCurrentQA(index)}>{result.id + 1}</div>
            ))}
          </div>
        </div>
        <div className={css.timeDisplay}>
          <div className={css.submitTime}>Submit time: <span>{this.props.detailInterviewee && this.props.detailInterviewee.submitTime}</span></div>
          <div className={css.durationTime}>Duration time: <span>{formatTime(this.props.resultOfEnglishTest.completeDurationTime)}</span> (total: <span>{formatTime(this.props.resultOfEnglishTest.durationTime)}</span>)</div>
        </div>
        <div className={css.reviews}>
          <h3 className={css.reviewsTitle}>Reviews</h3>
          <textarea className={css.reviewsContent} name="reviews" value={this.props.resultOfEnglishTest.reviews} placeholder={"Write down your reviews here..."} onChange={this.props.giveReviewsAndScores} />
        </div>
        <div className={css.scores}>
          <h3 className={css.scoresTitle}>Scores</h3>
          <input className={css.scoresValue} type="number" name="totalScore" step={0.1} min={0} max={10} value={this.props.resultOfEnglishTest.totalScore || 0} onChange={this.props.giveReviewsAndScores} />
        </div>
        <div className={css.saveButton} onClick={this.props.saveChanges}>
          <h3 className={css.buttonTitle}>Save changes</h3>
        </div>
      </div>
    )
  }
}

export default ControlPanel;