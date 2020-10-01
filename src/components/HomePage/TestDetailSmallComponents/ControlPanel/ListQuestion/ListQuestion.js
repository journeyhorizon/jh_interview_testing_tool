import React, { useContext } from "react";
import * as css from "./ListQuestion.module.scss";

// Context
import HomeContext from "../../../../../context/HomeContext";

const ListQuestion = () => {
  const { testStorage, currentQA, isBigScreen, changeCurrentQA, showMenuBar } = useContext(HomeContext);

  const changeQAAndCloseMenuBar = (index) => {
    if (!isBigScreen) {
      changeCurrentQA(index);
      showMenuBar();
    } else {
      changeCurrentQA(index);
    }
  }

  return (
    <>
      <div className={css.listQuestion}>
        <h3 className={css.listQuestionTitle}>List of Questions</h3>
        <div className={css.list}>
          {/* eslint-disable-next-line array-callback-return */}
          {testStorage.answerList && testStorage.answerList.map((result, index) => {
            if (result.answerContent === "" || result.answerContent.length === 0)
              return <div
                key={result.id}
                className={`${css.item} ${currentQA.id === result.id ? css.currentItem : ""}`}
                onClick={() => changeQAAndCloseMenuBar(index)}>{result.id + 1}
              </div>
          })}
        </div>
      </div>
      <div className={css.listQuestion}>
        <h3 className={css.listQuestionTitle}>List of Questions <span>(Answered)</span></h3>
        <div className={css.list}>
          {/* eslint-disable-next-line array-callback-return */}
          {testStorage.answerList && testStorage.answerList.map((result, index) => {
            if (result.answerContent !== "" && result.answerContent.length > 0)
              return <div
                key={result.id}
                className={`${css.item} ${currentQA.id === result.id ? css.currentItem : ""}`}
                onClick={() => changeQAAndCloseMenuBar(index)}>{result.id + 1}
              </div>
          })}
        </div>
      </div>
    </>
  )
}

export default ListQuestion;