import React, { useEffect, useRef } from "react";
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
const TESTLIST_CATEGORY_TYPE = {
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

const TestListCategory = (props) => {
  const imageSource = (type) => {
    switch (type) {
      case TESTLIST_CATEGORY_TYPE.LOGIC_TEST:
        return logicCategory;
      case TESTLIST_CATEGORY_TYPE.ENGLISH_TEST:
        return englishCategory;
      case TESTLIST_CATEGORY_TYPE.COMPLETE_NOTIFICATION:
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

const TestList = (props) => {
  const logicCategoryRef = useRef();
  const englishCategoryRef = useRef();
  const completeCategoryRef = useRef();

  useEffect(() => {
    !localStorage.getItem("interviewee") && props.history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const updateStatusOfTestCompleted = () => {
      localStorage.getItem(TEST_RESULT.LOGIC) && deactiveTestCategory(logicCategoryRef);
      localStorage.getItem(TEST_RESULT.ENGLISH) && deactiveTestCategory(englishCategoryRef);
    }

    const deactiveTestCategory = (categoryRef) => {
      categoryRef.current.classList.add(css.deactivedCategory);
    }

    updateStatusOfTestCompleted();
  }, [])

  useEffect(() => {
    const randomizeTestAndCreateAnswerResultForSavingData = async () => {
      const logicTestData = await myApi().get(
        "/interviewee/getListOfLogicTest",
        { params: { tableName: "logic-test" } }
      ).then(response => response.data);

      const englishTestData = await myApi().get(
        "/interviewee/getListOfEnglishTest",
        { params: { tableName: "english-test" } }
      ).then(response => response.data);

      !localStorage.getItem(LOCAL_STORAGE_TEST_TYPE_NAME.LOGIC)
        && randomizeTestAndSaveResult(LOCAL_STORAGE_TEST_TYPE_NAME.LOGIC, logicTestData);
      !localStorage.getItem(LOCAL_STORAGE_TEST_TYPE_NAME.ENGLISH)
        && randomizeTestAndSaveResult(LOCAL_STORAGE_TEST_TYPE_NAME.ENGLISH, englishTestData);
    }

    randomizeTestAndCreateAnswerResultForSavingData();
  }, [])

  useEffect(() => {
    const checkAllTestCompleted = () => {
      if (localStorage.getItem(TEST_RESULT.LOGIC) && localStorage.getItem(TEST_RESULT.ENGLISH)) return true;
      else return false;
    }

    const showCompleteCategoryOfTestList = () => {
      changeCategoryApperance(completeCategoryRef, css.showedCategory, css.hideCategory);
    }

    const hideTestCategoryOfTestList = () => {
      changeCategoryApperance(logicCategoryRef, css.hideCategory, css.showedCategory);
      changeCategoryApperance(englishCategoryRef, css.hideCategory, css.showedCategory);
    }

    const changeCategoryApperance = (elementRef, addClass, removeClass) => {
      elementRef.current.classList.add(addClass);
      elementRef.current.classList.remove(removeClass);
    }

    const mergeAllTestResult = async () => {
      const resultLength = await myApi().get("/interviewee/getLength", { params: { tableName: "result" } })
        .then(response => response.data);
      const logicTestResult = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TEST_TYPE_NAME.LOGIC));
      const englishtestResult = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TEST_TYPE_NAME.ENGLISH));

      const intervieweeId = JSON.parse(localStorage.getItem("interviewee")).id;
      const submitTime = new Date();

      localStorage.setItem("result", JSON.stringify({
        id: resultLength,
        intervieweeId,
        submitTime,
        resultOfEnglishTest:
          englishtestResult,
        resultOfLogicTest: logicTestResult
      }));
    }

    if (checkAllTestCompleted()) {
      showCompleteCategoryOfTestList();
      hideTestCategoryOfTestList();
      mergeAllTestResult();
    }
  }, [])

  return (
    <div className={css.container}>
      <div className={css.categoryList}>
        <Link ref={logicCategoryRef} className={`${css.link} ${css.showedCategory}`} to={{
          pathname: `/test/logictest`,
          state: {
            localStorageTestTypeName: LOCAL_STORAGE_TEST_TYPE_NAME.LOGIC,
            testStartingTime: STARTING_TIME.LOGIC,
            testResult: TEST_RESULT.LOGIC
          }
        }}>
          <TestListCategory type={TESTLIST_CATEGORY_TYPE.LOGIC_TEST} />
        </Link>
        <Link ref={englishCategoryRef} className={`${css.link} ${css.showedCategory}`} to={{
          pathname: `/test/englishtest`,
          state: {
            localStorageTestTypeName: LOCAL_STORAGE_TEST_TYPE_NAME.ENGLISH,
            testStartingTime: STARTING_TIME.ENGLISH,
            testResult: TEST_RESULT.ENGLISH
          }
        }}>
          <TestListCategory type={TESTLIST_CATEGORY_TYPE.ENGLISH_TEST} />
        </Link>
        <Link ref={completeCategoryRef} className={`${css.link} ${css.hideCategory}`} to={`/complete`}>
          <TestListCategory type={TESTLIST_CATEGORY_TYPE.COMPLETE_NOTIFICATION} />
        </Link>
      </div>
    </div>
  )
}

export default TestList;
