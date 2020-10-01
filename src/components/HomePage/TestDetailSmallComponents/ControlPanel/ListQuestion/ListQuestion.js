import React from "react";
import * as css from "./ListQuestion.module.scss";

const ListQuestion = (props) => {
  const changeQAAndCloseMenuBar = (index) => {
    if (!props.isBigScreen) {
      props.changeCurrentQA(index);
      props.showMenuBar();
    } else {
      props.changeCurrentQA(index);
    }
  }

  return (
    <>
      <div className={css.listQuestion}>
        <h3 className={css.listQuestionTitle}>List of Questions</h3>
        <div className={css.list}>
          {/* eslint-disable-next-line array-callback-return */}
          {props.testStorage.answerList && props.testStorage.answerList.map((result, index) => {
            if (result.answerContent === "" || result.answerContent.length === 0)
              return <div
                key={result.id}
                className={`${css.item} ${props.currentQA.id === result.id ? css.currentItem : ""}`}
                onClick={() => changeQAAndCloseMenuBar(index)}>{result.id + 1}
              </div>
          })}
        </div>
      </div>
      <div className={css.listQuestion}>
        <h3 className={css.listQuestionTitle}>List of Questions <span>(Answered)</span></h3>
        <div className={css.list}>
          {/* eslint-disable-next-line array-callback-return */}
          {props.testStorage.answerList && props.testStorage.answerList.map((result, index) => {
            if (result.answerContent !== "" && result.answerContent.length > 0)
              return <div
                key={result.id}
                className={`${css.item} ${props.currentQA.id === result.id ? css.currentItem : ""}`}
                onClick={() => changeQAAndCloseMenuBar(index)}>{result.id + 1}
              </div>
          })}
        </div>
      </div>
    </>
  )
}

export default ListQuestion;