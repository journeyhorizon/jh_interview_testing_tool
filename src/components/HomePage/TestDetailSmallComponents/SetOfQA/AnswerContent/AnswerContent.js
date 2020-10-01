import React, { useContext } from "react";
import * as css from "./AnswerContent.module.scss";

// Context
import HomeContext from "../../../../../context/HomeContext";

// ALIAS
const QUESTION_TYPE = {
  WH: "WH",
  SINGLE_CHOICE: "SINGLE_CHOICE",
  MULTIPLE_CHOICES: "MULTIPLE_CHOICES"
};

const AnswerContent = () => {
  const { currentQA } = useContext(HomeContext);

  if (currentQA.type === QUESTION_TYPE.WH)
    return <AnswerContentOfWhQuestion />
  else if (currentQA.type === QUESTION_TYPE.SINGLE_CHOICE)
    return <AnswerContentOfSingleChoiceQuestion />
  else if (currentQA.type === QUESTION_TYPE.MULTIPLE_CHOICES)
    return <AnswerContentOfMultipleChoicesQuestion />
  else return "";
}

const AnswerContentOfWhQuestion = () => {
  const { currentQA, handleChange } = useContext(HomeContext);

  return (
    <div className={css.currentAnswer}>
      <textarea name="answerContent" value={currentQA.answerContent} onChange={(e) => handleChange(e, QUESTION_TYPE.WH)} />
    </div>
  )
}

const AnswerContentOfSingleChoiceQuestion = (props) => {
  const { currentQA, handleChange } = useContext(HomeContext);

  return (
    <div className={css.currentAnswer}>
      {currentQA.choices.map((result, index) => (
        <div key={result.answerId} className={css.choice}>
          <input
            type="radio"
            name="answerContent"
            id={`answerChoice${currentQA.id}${index}`}
            value={result.answerId}
            onChange={(e) => handleChange(e, QUESTION_TYPE.SINGLE_CHOICE, result.answerId)}
            checked={currentQA.answerContent[0] === result.answerId}
          />
          <label htmlFor={`answerChoice${currentQA.id}${index}`}>
            <span>{result.answerContent}</span>
          </label>
        </div>
      ))}
    </div>
  )
}

const AnswerContentOfMultipleChoicesQuestion = (props) => {
  const { currentQA, handleChange } = useContext(HomeContext);

  return (
    <div className={css.currentAnswer}>
      {currentQA.choices.map((result, index) => {
        const isExist = currentQA.answerContent.includes(result.answerId);

        return (
          <div key={result.answerId} className={css.choice}>
            <input
              type="checkbox"
              name="answerContent"
              id={`answerChoice${currentQA.id}${index}`}
              value={result.answerId}
              onChange={(e) => handleChange(e, QUESTION_TYPE.MULTIPLE_CHOICES, isExist)}
              checked={isExist}
            />
            <label htmlFor={`answerChoice${currentQA.id}${index}`}>
              <span>{result.answerContent}</span>
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default AnswerContent;