import React from "react";
import * as css from "./AnswerContent.module.scss";

// ALIAS
const QUESTION_TYPE = {
  WH: "WH",
  SINGLE_CHOICE: "SINGLE_CHOICE",
  MULTIPLE_CHOICES: "MULTIPLE_CHOICES"
};

const AnswerContent = (props) => {
  const currentQA = props.currentQA;

  if (currentQA.type === QUESTION_TYPE.WH) return <AnswerContentOfWhQuestion currentQA={currentQA} />
  else if (currentQA.type === QUESTION_TYPE.SINGLE_CHOICE) return <AnswerContentOfSingleChoiceQuestion currentQA={currentQA} />
  else if (currentQA.type === QUESTION_TYPE.MULTIPLE_CHOICES) return <AnswerContentOfMultipleChoicesQuestion currentQA={currentQA} />
  else return "";
}

const AnswerContentOfWhQuestion = (props) => {
  const currentQA = props.currentQA;

  return (
    <div className={css.currentAnswer}>
      <textarea value={currentQA.answerContent} readOnly={true} />
    </div>
  )
}

const AnswerContentOfSingleChoiceQuestion = (props) => {
  const currentQA = props.currentQA;

  return (
    <div className={css.currentAnswer}>
      {currentQA.choices.map((result, index) => (
        <form
          key={result.answerId} className={`${css.choice} ${currentQA.answerContent[0] !== result.answerId
            ? result.isCorrect
              ? css.highlightLabelOfRightChoice
              : ""
            : result.isCorrect
              ? css.highlightLabelOfRightChoice
              : css.highlightLabelOfWrongChoice
            }`}>
          <input
            type="radio"
            name="answerChoice"
            id={`answerChoice${currentQA.id}${index}`}
            value={result.answerContent}
            readOnly={true}
            checked={currentQA.answerContent[0] === result.answerId}
          />
          <label htmlFor={`answerChoice${currentQA.id}${index}`}>
            <span>{result.answerContent}</span>
            {currentQA.answerContent[0] !== result.answerId
              ? ""
              : result.isCorrect
                ? <span className={css.symbolOfCorrectAnswer}>&#10004;</span>
                : <span className={css.symbolOfIncorrectAnswer}>&#10008;</span>
            }
          </label>
        </form>
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
          <div key={result.answerId} className={`${css.choice} ${isExist
            ? result.isCorrect
              ? css.highlightLabelOfRightChoice
              : css.highlightLabelOfWrongChoice
            : result.isCorrect
              ? css.highlightLabelOfRightChoice
              : ""
            }`}>
            <input
              type="checkbox"
              name="answerChoice"
              id={`answerChoice${currentQA.id}${index}`}
              value={result.answerContent}
              readOnly={true}
              checked={isExist}
            />
            <label htmlFor={`answerChoice${currentQA.id}${index}`}>
              <span>{result.answerContent}</span>
              {isExist
                ? result.isCorrect
                  ? <span className={css.symbolOfCorrectAnswer}>&#10004;</span>
                  : <span className={css.symbolOfIncorrectAnswer}>&#10008;</span>
                : ""
              }
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default AnswerContent;