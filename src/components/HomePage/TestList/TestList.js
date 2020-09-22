import React from "react";
import { Link } from "react-router-dom";
import * as css from "./TestList.module.scss";

// Utils
import { randomizeTestAndSaveResult } from "../../../utils/randomizeTestAndSaveResult";

// Data
import result from "../../../mockdata/result.json";
import englishTestData from "../../../mockdata/english-test.json";
import logicTestData from "../../../mockdata/logic-test.json";

// Assets
import logicCategory from "../../../assets/testlist-category/logicCategory.png";
import englishCategory from "../../../assets/testlist-category/englishCategory.png";
import completeCategory from "../../../assets/testlist-category/completeCategory.png";

// ALIAS
const CATEGORY_TYPE = {
  LOGIC_TEST: "Logic Test",
  ENGLISH_TEST: "English Test",
  COMPLETE_NOTIFICATION: "Go!"
}

const TEST_TYPE = {
  LOGIC: "currentSetOfTestAndResultOfLogic",
  ENGLISH: "currentSetOfTestAndResultOfEnglish"
}

function TestListCategory(props) {
  const imageSource = (type) => {
    switch (type) {
      case CATEGORY_TYPE.LOGIC_TEST:
        return logicCategory;
      case CATEGORY_TYPE.ENGLISH_TEST:
        return englishCategory;
      case CATEGORY_TYPE.COMPLETE_NOTIFICATION:
        return completeCategory;
      default: return null;
    }
  }

  return (
    <div className={css.categoryItem}>
      <img className={css.categoryIcon} src={imageSource(props.type)} alt="icon" />
      <h3 className={css.categoryName}>{props.type}</h3>
    </div>
  )
}

class TestList extends React.Component {
  constructor() {
    super();

    this.state = {
      isLogicTestCompleted: false,
      isEnglishTestCompleted: false
    }
  }

  componentDidMount() {
    !localStorage.getItem("interviewee") && this.props.history.push("/");
    this.enableNavigationPrompt();
    this.updateStatusOfTestCompleted();
    this.randomizeTestAndCreateAnswerResultForSavingData();

    if (this.checkAllTestCompleted()) {
      this.showCompleteCategory();
      this.hideTestCategory();
      this.mergeAllTestResult();
    } else {
      this.state.isLogicTestCompleted && this.deactiveTestCategory("logicCategory");
      this.state.isEnglishTestCompleted && this.deactiveTestCategory("englishCategory");
    }
  }

  enableNavigationPrompt() {
    window.onbeforeunload = function () {
      return true;
    };
  }

  updateStatusOfTestCompleted() {
    localStorage.getItem("logicTestResult") && this.setState({ isLogicTestCompleted: true });
    localStorage.getItem("englishTestResult") && this.setState({ isEnglishTestCompleted: true });
  }

  randomizeTestAndCreateAnswerResultForSavingData() {
    !localStorage.getItem(TEST_TYPE.LOGIC) && randomizeTestAndSaveResult(TEST_TYPE.LOGIC, logicTestData);
    !localStorage.getItem(TEST_TYPE.ENGLISH) && randomizeTestAndSaveResult(TEST_TYPE.ENGLISH, englishTestData);
  }

  checkAllTestCompleted() {
    if (this.state.isLogicTestCompleted && this.state.isEnglishTestCompleted) return true;
    else return false;
  }

  showCompleteCategory() {
    document.getElementById("completeCategory").classList.add(css.showedCategory);
    document.getElementById("completeCategory").classList.remove(css.hideCategory);
  }

  hideTestCategory() {
    document.getElementById("logicCategory").classList.remove(css.showedCategory);
    document.getElementById("logicCategory").classList.add(css.hideCategory);
    document.getElementById("englishCategory").classList.remove(css.showedCategory);
    document.getElementById("englishCategory").classList.add(css.hideCategory);
  }

  mergeAllTestResult() {
    const logictestResult = JSON.parse(localStorage.getItem("logictestResult"));
    const englishtestResult = JSON.parse(localStorage.getItem("englishtestResult"));

    const resultId = result.length;
    const intervieweeId = JSON.parse(localStorage.getItem("interviewee")).id;
    const submitTime = new Date();

    localStorage.setItem("result", { id: resultId, intervieweeId, submitTime, resultOfEnglishTest: englishtestResult, resultOfLogicTest: logictestResult });
  }

  deactiveTestCategory(categoryId) {
    document.getElementById(categoryId).classList.add(css.deactivedCategory);
  }

  render() {
    return (
      <div className={css.container}>
        <div className={css.categoryList}>
          <Link id="logicCategory" className={`${css.link} ${css.showedCategory}`} to={{
            pathname: `/test/logictest`,
            state: {}
          }}>
            <TestListCategory type={CATEGORY_TYPE.LOGIC_TEST} />
          </Link>
          <Link id="englishCategory" className={`${css.link} ${css.showedCategory}`} to={{
            pathname: `/test/englishtest`,
            state: {}
          }}>
            <TestListCategory type={CATEGORY_TYPE.ENGLISH_TEST} />
          </Link>
          <Link id="completeCategory" className={`${css.link} ${css.hideCategory}`} to={`/complete`}>
            <TestListCategory type={CATEGORY_TYPE.COMPLETE_NOTIFICATION} />
          </Link>
        </div>
      </div>
    )
  }
}

export default TestList;
