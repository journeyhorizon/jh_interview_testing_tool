import React, { useContext } from "react";
import * as css from "./SetOfQA.module.scss";

// Components
import AnswerContent from "./AnswerContent/AnswerContent";

// Context
import HomeContext from "../../../../context/HomeContext";

// Assets
import arrowRight from "../../../../assets/icons/arrow-right.png";
import arrowLeft from "../../../../assets/icons/arrow-left.png";

const SetOfQA = (props) => {
  const { currentQA } = useContext(HomeContext);

  return (
    <div className={css.setOfQA}>
      <h3 className={css.currentQuestion}>Question: <span>{currentQA.questionContent}</span></h3>
      <AnswerContent />
      <div className={css.navigation}>
        <div className={css.arrowButton} onClick={() => props.navigateQA(-1)}>
          <img src={arrowLeft} alt="arrow left navigation" />
        </div>
        <div className={css.arrowButton} onClick={() => props.navigateQA(1)}>
          <img src={arrowRight} alt="arrow right navigation" />
        </div>
      </div>
    </div>
  )
}

export default SetOfQA;