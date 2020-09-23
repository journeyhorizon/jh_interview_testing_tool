import React from "react";
import * as css from "./SetOfQA.module.scss";

// Components
import AnswerContent from "./AnswerContent/AnswerContent";

// Assets
import arrowRight from "../../../../assets/icons/arrow-right.png";
import arrowLeft from "../../../../assets/icons/arrow-left.png";

class SetOfQA extends React.Component {
  render() {
    const currentQA = this.props.currentQA;

    return (
      <div className={css.setOfQA}>
        <h3 className={css.currentQuestion}>Question: <span>{currentQA.questionContent}</span></h3>
        <AnswerContent currentQA={currentQA} handleChange={this.props.handleChange} />
        <div className={css.navigation}>
          <div className={css.arrowButton} onClick={() => this.props.navigateQA(-1)}>
            <img src={arrowLeft} alt="arrow left navigation" />
          </div>
          <div className={css.arrowButton} onClick={() => this.props.navigateQA(1)}>
            <img src={arrowRight} alt="arrow right navigation" />
          </div>
        </div>
      </div>
    )
  }
}

export default SetOfQA;