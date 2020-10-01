import React, { useEffect, useRef, useState } from "react";
import * as css from "./TestDetail.module.scss";

// Components
import MobileNavbar from "../../common/MobileNavbar/MobileNavbar";
import MenuBar from "../../common/MenuBar/MenuBar";
import SetOfQA from "../TestDetailSmallComponents/SetOfQA/SetOfQA";
import ControlPanel from "../TestDetailSmallComponents/ControlPanel/ControlPanel";
import WarningNotification from "../TestDetailSmallComponents/WarningNotification/WarningNotification";

// Utils
import { countdownTimer } from "../../../utils/countdownTimer";

// Context
import HomeContext from "../../../context/HomeContext";

// ALIAS
const TEST_RESULT = {
  LOGIC: "logicTestResult",
  ENGLISH: "englishTestResult"
}

const PATHNAME = {
  LOGIC: "/test/logictest",
  ENGLISH: "/test/englishtest"
}

const QUESTION_TYPE = {
  WH: "WH",
  SINGLE_CHOICE: "SINGLE_CHOICE",
  MULTIPLE_CHOICES: "MULTIPLE_CHOICES"
};

const STATUS_OF_SUBMIT = {
  OUT_OF_TIME: "out of time",
  NOT_FULFILL_ANSWER_LIST: "not fulfill answer list",
  FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE: "time still available",
  FORCE_SUBMIT: "force submit"
}

const NOTIFICATION_MESSAGE_FOR_DEFER_SUBMIT = {
  NO_DISPLAY: "",
  NOT_FULFILL_ANSWER_LIST: "You haven't fulfill all questions. Please check carefully!",
  FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE: "You still have time left. Make sure you check carefully!",
}

const TestDetail = (props) => {
  const [testStorage, setTestStorage] = useState({});
  const [currentQA, setCurrentQA] = useState({});
  const [currentMinutes, setCurrentMinutes] = useState(null);
  const [currentSeconds, setCurrentSeconds] = useState(null);
  const [menuBar, setMenuBar] = useState(null);
  const [isBigScreen, setIsBigScreen] = useState(false);
  const [notificationWhenDeferSubmit, setNotificationWhenDeferSubmit] = useState({
    isShow: false,
    message: ""
  });

  const timerIntervalMethodRef = useRef();

  useEffect(() => {
    !localStorage.getItem("interviewee") && props.history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth > 1200) {
        setMenuBar(null);
        setIsBigScreen(true);
      } else setIsBigScreen(false);
    }

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => { window.removeEventListener("resize", updateDimensions); }
  }, [])

  useEffect(() => {
    const checkIsTestCompleted = (pathname) => {
      if ((pathname === PATHNAME.LOGIC && localStorage.getItem(TEST_RESULT.LOGIC)) ||
        (pathname === PATHNAME.ENGLISH && localStorage.getItem(TEST_RESULT.ENGLISH))) {
        props.history.push("/testlist");
        return true;
      } else return false;
    }

    const checkCountdownTimerIsStarted = () => {
      return localStorage.getItem(props.location.state.testStartingTime) ? true : false;
    }

    const signStartingTime = () => {
      localStorage.setItem(props.location.state.testStartingTime, new Date());
    }

    if (!checkIsTestCompleted(props.location.pathname)) {
      !checkCountdownTimerIsStarted() && signStartingTime();

      const testStorage = JSON.parse(localStorage.getItem(props.location.state.localStorageTestTypeName));
      setTestStorage(testStorage);
      setCurrentQA(testStorage.answerList[0]);
      timerIntervalMethodRef.current = setInterval(() => {
        activateCountdownTimer(localStorage.getItem(props.location.state.testStartingTime), testStorage.durationTime)
      }, 1000);
    }

    return () => { deactivateCountdownTimer(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    isOutOfTime() && submitTest(STATUS_OF_SUBMIT.OUT_OF_TIME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMinutes, currentSeconds])

  const activateCountdownTimer = (startTime, testDurationTime) => {
    const timerSet = countdownTimer(startTime, testDurationTime);
    setCurrentSeconds(timerSet.seconds);
    setCurrentMinutes(timerSet.minutes);

    if (timerSet.minutes === "00" && timerSet.seconds === "00") {
      deactivateCountdownTimer();
    }
  }

  const deactivateCountdownTimer = () => {
    clearInterval(timerIntervalMethodRef.current);
  }

  const showMenuBar = () => {
    setMenuBar(!menuBar);
  }

  const handleChange = (event, questionType, isChecked) => {
    const autoSaveCurrentQA = (value, questionType, isChecked) => {
      switch (questionType) {
        case QUESTION_TYPE.WH:
          return { ...currentQA, answerContent: value };
        case QUESTION_TYPE.SINGLE_CHOICE:
          return { ...currentQA, answerContent: [parseInt(value)] };
        case QUESTION_TYPE.MULTIPLE_CHOICES: {
          if (!isChecked) {
            const newAnswerArr = [...currentQA.answerContent];
            newAnswerArr.push(parseInt(value));
            return { ...currentQA, answerContent: newAnswerArr };
          } else {
            const newAnswerArr = currentQA.answerContent.filter(item => item !== parseInt(value));
            return { ...currentQA, answerContent: newAnswerArr }
          }
        }
        default: return null;
      }
    }

    const newCurrentQA = autoSaveCurrentQA(event.target.value, questionType, isChecked);

    const newAnswerList = testStorage.answerList.reduce((newArr, item) => {
      if (item.id === currentQA.id)
        newArr.push(newCurrentQA);
      else newArr.push(item);

      return newArr;
    }, []);
    const newTestStorage = { ...testStorage, answerList: newAnswerList };

    updateNewDataForStateAndLocalStorage(newTestStorage, newCurrentQA);
  }

  const updateNewDataForStateAndLocalStorage = (newTestStorage, newCurrentQA) => {
    newCurrentQA && setCurrentQA(newCurrentQA);
    setTestStorage(newTestStorage);
    localStorage.setItem(props.location.state.localStorageTestTypeName, JSON.stringify(newTestStorage));
  }

  const changeCurrentQA = (index) => {
    setCurrentQA(testStorage.answerList[index]);
  }

  const navigateQA = (step) => {
    if (testStorage.answerList) {
      const currentIndex = testStorage.answerList.findIndex(item => item.id === currentQA.id);
      const newIndex = currentIndex + step;

      if (newIndex < 0) changeCurrentQA(testStorage.answerList.length - 1);
      else if (newIndex >= testStorage.answerList.length) changeCurrentQA(0);
      else changeCurrentQA(newIndex);
    }
  }

  const isOutOfTime = () => {
    if (currentMinutes === "00" && currentSeconds === "00") return true;
    else return false;
  }

  const submitTest = (isForceSubmit) => {
    switch (checkOutOfTimeAndFulfillAnswerList(isForceSubmit)) {
      case STATUS_OF_SUBMIT.OUT_OF_TIME: {
        submitTest(true);
        break;
      }
      case STATUS_OF_SUBMIT.NOT_FULFILL_ANSWER_LIST: {
        showNotificationWhenDeferSubmit(STATUS_OF_SUBMIT.NOT_FULFILL_ANSWER_LIST);
        break;
      }
      case STATUS_OF_SUBMIT.FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE: {
        showNotificationWhenDeferSubmit(STATUS_OF_SUBMIT.FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE);
        break;
      }
      case STATUS_OF_SUBMIT.FORCE_SUBMIT: {
        localStorage.setItem(props.location.state.testResult, true);
        saveIntervieweeTestingRecord();
        props.history.push("/testlist");
        break;
      }
      default: console.log("Bug");
    }
  }

  const checkOutOfTimeAndFulfillAnswerList = (isForceSubmit) => {
    const currentAnswerList = testStorage.answerList;

    if (isForceSubmit) return STATUS_OF_SUBMIT.FORCE_SUBMIT;
    else {
      const isOutOfTime = currentMinutes === "00" ? currentSeconds === "00" ? true : false : false;
      const isNotFulFill = () => {
        if (props.location.pathname === PATHNAME.LOGIC)
          return currentAnswerList.some(item => item.answerContent.length === 0);
        if (props.location.pathname === PATHNAME.ENGLISH)
          return currentAnswerList.some(item => item.answerContent === "");
      }

      if (isOutOfTime) return STATUS_OF_SUBMIT.OUT_OF_TIME;
      else {
        if (isNotFulFill()) return STATUS_OF_SUBMIT.NOT_FULFILL_ANSWER_LIST;
        else return STATUS_OF_SUBMIT.FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE;
      }
    }
  }

  const showNotificationWhenDeferSubmit = (status, isNotShow) => {
    const newMessage = (status) => {
      if (status === "") return NOTIFICATION_MESSAGE_FOR_DEFER_SUBMIT.NO_DISPLAY;
      if (status === STATUS_OF_SUBMIT.NOT_FULFILL_ANSWER_LIST)
        return NOTIFICATION_MESSAGE_FOR_DEFER_SUBMIT.NOT_FULFILL_ANSWER_LIST;
      if (status === STATUS_OF_SUBMIT.FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE)
        return NOTIFICATION_MESSAGE_FOR_DEFER_SUBMIT.FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE;
    }

    const newNotification = {
      isShow: !isNotShow,
      message: newMessage(status)
    }

    setNotificationWhenDeferSubmit(newNotification);
  }

  const saveIntervieweeTestingRecord = () => {
    const completeDurationTime = saveCompleteDurationTime();
    const { newAnswerList, totalScore } = props.location.state.testResult === TEST_RESULT.LOGIC && scoresLogicQA();

    const newTestStorage = props.location.state.testResult === TEST_RESULT.LOGIC
      ? {
        ...testStorage,
        answerList: newAnswerList,
        completeDurationTime,
        totalScore
      } : {
        ...testStorage,
        completeDurationTime
      };

    updateNewDataForStateAndLocalStorage(newTestStorage);
  }

  const saveCompleteDurationTime = () => {
    if (isOutOfTime()) return testStorage.durationTime;
    else return testStorage.durationTime - (parseInt(currentMinutes) * 60 + parseInt(currentSeconds));
  }

  const scoresLogicQA = () => {
    const newAnswerList = testStorage.answerList.map(result => {
      if (result.type === QUESTION_TYPE.WH) return null;

      if (result.type === QUESTION_TYPE.SINGLE_CHOICE) {
        if (result.answerContent.length === 0) result.point = false;
        else {
          if (result.rightChoices[0] === result.answerContent[0]) result.point = true;
          else result.point = false;
        }
      }

      if (result.type === QUESTION_TYPE.MULTIPLE_CHOICES) {
        if (result.answerContent.length === 0) result.point = false;
        else {
          const point = result.answerContent.reduce((isWrong, item) => {
            if (!result.rightChoices.includes(item)) isWrong = false;
            return isWrong;
          }, true)
          result.point = point;
        }
      }
      return result;
    })

    const totalCorrectAnswer = newAnswerList.reduce((score, item) => {
      if (item.point) score += 1;
      return score;
    }, 0)

    const totalScore = Number(parseFloat((totalCorrectAnswer / newAnswerList.length) * 10).toFixed(1));

    return { newAnswerList, totalScore };
  }

  return (
    <HomeContext.Provider value={{
      currentSeconds,
      currentMinutes,
      currentQA,
      testStorage,
      isBigScreen,
      showMenuBar,
      handleChange,
      changeCurrentQA
    }}>
      <div className={css.container}>
        <div className={css.smallContainer}>
          <MobileNavbar
            currentQA={currentQA}
            storage={testStorage}
            showMenuBar={showMenuBar}
          />
          <SetOfQA navigateQA={navigateQA} />
          <ControlPanel
            currentMinutes={currentMinutes}
            currentSeconds={currentSeconds}
            isBigScreen={isBigScreen}
            testStorage={testStorage}
            currentQA={currentQA}
            changeCurrentQA={changeCurrentQA}
            handleSubmit={submitTest}
          />
        </div>
        <MenuBar
          isBigScreen={isBigScreen}
          isShow={menuBar}
          currentQA={currentQA}
          testStorage={testStorage}
          currentMinutes={currentMinutes}
          currentSeconds={currentSeconds}
          changeCurrentQA={changeCurrentQA}
          showMenuBar={showMenuBar}
          handleSubmit={submitTest}
        />
      </div>
      <WarningNotification
        notificationWhenDeferSubmit={notificationWhenDeferSubmit}
        showNotificationWhenDeferSubmit={showNotificationWhenDeferSubmit}
        submitTest={submitTest}
      />
    </HomeContext.Provider>
  )
}
export default TestDetail;