import React from "react";
import { Link } from "react-router-dom";
import * as css from "./TestList.module.scss";

// Utils
import { randomizeTestAndSaveResult } from "../../../utils/randomizeTestAndSaveResult";

// Api
import myApi from "../../../api/myApi";

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

const LOCAL_STORAGE_TEST_TYPE_NAME = {
  LOGIC: "currentSetOfTestAndResultOfLogic",
  ENGLISH: "currentSetOfTestAndResultOfEnglish"
}

const STARTING_TIME = {
  LOGIC: "LOGIC_STARTING_TIME",
  ENGLISH: "ENGLISH_STARTING_TIME"
}

const TEST_RESULT = {
  LOGIC: "logicTestResult",
  ENGLISH: "englishTestResult"
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
  componentDidMount() {
    !localStorage.getItem("interviewee") && this.props.history.push("/");
    // this.enableNavigationPrompt();
    this.updateStatusOfTestCompleted();
    this.randomizeTestAndCreateAnswerResultForSavingData();

    if (this.checkAllTestCompleted()) {
      this.showCompleteCategory();
      this.hideTestCategory();
      this.mergeAllTestResult();
    }
  }

  enableNavigationPrompt() {
    window.onbeforeunload = function () {
      return true;
    };
  }

  updateStatusOfTestCompleted() {
    localStorage.getItem(TEST_RESULT.LOGIC) && this.deactiveTestCategory("logicCategory");
    localStorage.getItem(TEST_RESULT.ENGLISH) && this.deactiveTestCategory("englishCategory");
  }

  async randomizeTestAndCreateAnswerResultForSavingData() {
    const logicTestData = await myApi().get("/interviewee/getListOfLogicTest", { params: { tableName: "logic-test" } }).then(response => response.data);
    const englishTestData = await myApi().get("/interviewee/getListOfEnglishTest", { params: { tableName: "english-test" } }).then(response => response.data);

    !localStorage.getItem(LOCAL_STORAGE_TEST_TYPE_NAME.LOGIC) && randomizeTestAndSaveResult(LOCAL_STORAGE_TEST_TYPE_NAME.LOGIC, logicTestData);
    !localStorage.getItem(LOCAL_STORAGE_TEST_TYPE_NAME.ENGLISH) && randomizeTestAndSaveResult(LOCAL_STORAGE_TEST_TYPE_NAME.ENGLISH, englishTestData);
  }

  checkAllTestCompleted() {
    if (localStorage.getItem(TEST_RESULT.LOGIC) && localStorage.getItem(TEST_RESULT.ENGLISH)) return true;
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

  async mergeAllTestResult() {
    const resultLength = await myApi().get("/interviewee/getLength", { params: { tableName: "result" } }).then(response => response.data);
    const logicTestResult = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TEST_TYPE_NAME.LOGIC));
    const englishtestResult = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TEST_TYPE_NAME.ENGLISH));

    const intervieweeId = JSON.parse(localStorage.getItem("interviewee")).id;
    const submitTime = new Date();

    localStorage.setItem("result", JSON.stringify({ id: resultLength, intervieweeId, submitTime, resultOfEnglishTest: englishtestResult, resultOfLogicTest: logicTestResult }));
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
            state: {
              localStorageTestTypeName: LOCAL_STORAGE_TEST_TYPE_NAME.LOGIC,
              testStartingTime: STARTING_TIME.LOGIC,
              testResult: TEST_RESULT.LOGIC
            }
          }}>
            <TestListCategory type={CATEGORY_TYPE.LOGIC_TEST} />
          </Link>
          <Link id="englishCategory" className={`${css.link} ${css.showedCategory}`} to={{
            pathname: `/test/englishtest`,
            state: {
              localStorageTestTypeName: LOCAL_STORAGE_TEST_TYPE_NAME.ENGLISH,
              testStartingTime: STARTING_TIME.ENGLISH,
              testResult: TEST_RESULT.ENGLISH

            }
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
