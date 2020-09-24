import React from "react";
import * as css from "./ListQuestion.module.scss";

class ListQuestion extends React.Component {

  changeQAAndCloseMenuBar(index) {
    if (!this.props.isBigScreen) {
      this.props.changeCurrentQA(index);
      this.props.showMenuBar();
    } else {
      this.props.changeCurrentQA(index);
    }
  }

  render() {
    return (
      <>
        <div className={css.listQuestion}>
          <h3 className={css.listQuestionTitle}>List of Questions</h3>
          <div className={css.list}>
            {/* eslint-disable-next-line array-callback-return */}
            {this.props.testStorage.answerList && this.props.testStorage.answerList.map((result, index) => {
              if (result.answerContent === "" || result.answerContent.length === 0)
                return (<div key={result.id} className={`${css.item} ${this.props.currentQA.id === result.id ? css.currentItem : ""}`} onClick={() => this.changeQAAndCloseMenuBar(index)}>{result.id + 1}</div>)
            })}
          </div>
        </div>
        <div className={css.listQuestion}>
          <h3 className={css.listQuestionTitle}>List of Questions <span>(Answered)</span></h3>
          <div className={css.list}>
            {/* eslint-disable-next-line array-callback-return */}
            {this.props.testStorage.answerList && this.props.testStorage.answerList.map((result, index) => {
              if (result.answerContent !== "" && result.answerContent.length > 0)
                return <div key={result.id} className={`${css.item} ${this.props.currentQA.id === result.id ? css.currentItem : ""}`} onClick={() => this.changeQAAndCloseMenuBar(index)}>{result.id + 1}</div>
            })}
          </div>
        </div>
      </>
    )
  }
}

export default ListQuestion;