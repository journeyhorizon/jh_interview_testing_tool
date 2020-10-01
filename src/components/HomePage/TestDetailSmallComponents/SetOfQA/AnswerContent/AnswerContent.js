import React from "react";
import * as css from "./AnswerContent.module.scss";

// ALIAS
const QUESTION_TYPE = {
  WH: "WH",
  SINGLE_CHOICE: "SINGLE_CHOICE",
  MULTIPLE_CHOICES: "MULTIPLE_CHOICES"
};

const AnswerContent = (props) => {
  if (props.currentQA.type === QUESTION_TYPE.WH)
    return <AnswerContentOfWhQuestion currentQA={props.currentQA} handleChange={props.handleChange} />
  else if (props.currentQA.type === QUESTION_TYPE.SINGLE_CHOICE)
    return <AnswerContentOfSingleChoiceQuestion currentQA={props.currentQA} handleChange={props.handleChange} />
  else if (props.currentQA.type === QUESTION_TYPE.MULTIPLE_CHOICES)
    return <AnswerContentOfMultipleChoicesQuestion currentQA={props.currentQA} handleChange={props.handleChange} />
  else return "";
}

const AnswerContentOfWhQuestion = (props) => {
  const currentQA = props.currentQA;

  return (
    <div className={css.currentAnswer}>
      <textarea name="answerContent" value={currentQA.answerContent} onChange={(e) => props.handleChange(e, QUESTION_TYPE.WH)} />
    </div>
  )
}

const AnswerContentOfSingleChoiceQuestion = (props) => {
  const currentQA = props.currentQA;

  return (
    <div className={css.currentAnswer}>
      {currentQA.choices.map((result, index) => (
        <div key={result.answerId} className={css.choice}>
          <input
            type="radio"
            name="answerContent"
            id={`answerChoice${currentQA.id}${index}`}
            value={result.answerId}
            onChange={(e) => props.handleChange(e, QUESTION_TYPE.SINGLE_CHOICE, result.answerId)}
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
  const currentQA = props.currentQA;

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
              onChange={(e) => props.handleChange(e, QUESTION_TYPE.MULTIPLE_CHOICES, isExist)}
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