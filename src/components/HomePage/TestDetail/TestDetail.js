import React from "react";
import * as css from "./TestDetail.module.scss";

// Components
import MobileNavbar from "../../common/MobileNavbar/MobileNavbar";
import MenuBar from "../../common/MenuBar/MenuBar";
import SetOfQA from "../TestDetailSmallComponents/SetOfQA/SetOfQA";
import ControlPanel from "../TestDetailSmallComponents/ControlPanel/ControlPanel";
import WarningNotification from "../TestDetailSmallComponents/WarningNotification/WarningNotification";


// Utils
import { countdownTimer } from "../../../utils/countdownTimer";

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

class TestDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      testStorage: {},
      currentQA: {},
      currentMinutes: null,
      currentSeconds: null,
      menuBar: null,
      isBigScreen: false,
      notificationWhenDeferSubmit: { isShow: false, message: "" }
    }

    this.showMenuBar = this.showMenuBar.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeCurrentQA = this.changeCurrentQA.bind(this);
    this.navigateQA = this.navigateQA.bind(this);
    this.showNotificationWhenDeferSubmit = this.showNotificationWhenDeferSubmit.bind(this);
    this.submitTest = this.submitTest.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    !localStorage.getItem("interviewee") && this.props.history.push("/");
    window.addEventListener("resize", this.updateDimensions);

    if (!this.checkIsTestCompleted(this.props.location.pathname)) {
      this.updateDimensions();
      !this.checkCountdownTimerIsStarted() && this.signStartingTime();

      const testStorage = JSON.parse(localStorage.getItem(this.props.location.state.localStorageTestTypeName));
      this.setState({ testStorage });
      this.setState({ currentQA: testStorage.answerList[0] })
      this.timerIntervalMethod = setInterval(() => {
        this.activateCountdownTimer(localStorage.getItem(this.props.location.state.testStartingTime), testStorage.durationTime)
      }, 1000);
    }
  }

  checkIsTestCompleted(pathname) {
    if ((pathname === PATHNAME.LOGIC && localStorage.getItem(TEST_RESULT.LOGIC)) ||
      (pathname === PATHNAME.ENGLISH && localStorage.getItem(TEST_RESULT.ENGLISH))) {
      this.props.history.push("/testlist");
      return true;
    } else return false;
  }

  updateDimensions() {
    if (this._isMounted)
      if (window.innerWidth > 1200) {
        this.setState({ menuBar: null });
        this.setState({ isBigScreen: true });
      } else this.setState({ isBigScreen: false });
  }

  checkCountdownTimerIsStarted() {
    return localStorage.getItem(this.props.location.state.testStartingTime) ? true : false;
  }

  signStartingTime() {
    localStorage.setItem(this.props.location.state.testStartingTime, new Date());
  }

  activateCountdownTimer(startTime, testDurationTime) {
    const timerSet = countdownTimer(startTime, testDurationTime);
    this.setState({ currentMinutes: timerSet.minutes, currentSeconds: timerSet.seconds });

    if (timerSet.minutes === "00" && timerSet.seconds === "00") {
      this.deactivateCountdownTimer();
    }
  }

  deactivateCountdownTimer() {
    clearInterval(this.timerIntervalMethod);
  }

  showMenuBar() {
    this.setState({ menuBar: !this.state.menuBar });
  }

  handleChange(event, questionType, isChecked) {
    const newCurrentQA = this.autoSaveCurrentQA(event.target.value, questionType, isChecked);

    const newAnswerList = this.state.testStorage.answerList.reduce((newArr, item) => {
      if (item.id === this.state.currentQA.id)
        newArr.push(newCurrentQA);
      else newArr.push(item);

      return newArr;
    }, []);
    const newTestStorage = { ...this.state.testStorage, answerList: newAnswerList };

    this.updateNewDataForStateAndLocalStorage(newTestStorage, newCurrentQA);
  }

  autoSaveCurrentQA(value, questionType, isChecked) {
    switch (questionType) {
      case QUESTION_TYPE.WH:
        return { ...this.state.currentQA, answerContent: value };
      case QUESTION_TYPE.SINGLE_CHOICE:
        return { ...this.state.currentQA, answerContent: [parseInt(value)] };
      case QUESTION_TYPE.MULTIPLE_CHOICES: {
        if (!isChecked) {
          const newAnswerArr = [...this.state.currentQA.answerContent];
          newAnswerArr.push(parseInt(value));
          return { ...this.state.currentQA, answerContent: newAnswerArr };
        } else {
          const newAnswerArr = this.state.currentQA.answerContent.filter(item => item !== parseInt(value));
          return { ...this.state.currentQA, answerContent: newAnswerArr }
        }
      }
      default: return null;
    }
  }

  updateNewDataForStateAndLocalStorage(newTestStorage, newCurrentQA) {
    newCurrentQA && this.setState({ currentQA: newCurrentQA });
    this.setState({ testStorage: newTestStorage });
    localStorage.setItem(this.props.location.state.localStorageTestTypeName, JSON.stringify(newTestStorage));
  }

  changeCurrentQA(index) {
    this.setState({ currentQA: this.state.testStorage.answerList[index] });
  }

  navigateQA(step) {
    if (this.state.testStorage.answerList) {
      const currentIndex = this.state.testStorage.answerList.findIndex(item => item.id === this.state.currentQA.id);
      const newIndex = currentIndex + step;

      if (newIndex < 0) this.changeCurrentQA(this.state.testStorage.answerList.length - 1);
      else if (newIndex >= this.state.testStorage.answerList.length) this.changeCurrentQA(0);
      else this.changeCurrentQA(newIndex);
    }
  }

  isOutOfTime() {
    if (this.state.currentMinutes === "00" && this.state.currentSeconds === "00")
      return true;
    else return false;
  }

  submitTest(isForceSubmit) {
    switch (this.checkOutOfTimeAndFulfillAnswerList(isForceSubmit)) {
      case STATUS_OF_SUBMIT.OUT_OF_TIME: {
        this.submitTest(true);
        break;
      }
      case STATUS_OF_SUBMIT.NOT_FULFILL_ANSWER_LIST: {
        this.showNotificationWhenDeferSubmit(STATUS_OF_SUBMIT.NOT_FULFILL_ANSWER_LIST);
        break;
      }
      case STATUS_OF_SUBMIT.FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE: {
        this.showNotificationWhenDeferSubmit(STATUS_OF_SUBMIT.FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE);
        break;
      }
      case STATUS_OF_SUBMIT.FORCE_SUBMIT: {
        localStorage.setItem(this.props.location.state.testResult, true);
        this.saveIntervieweeTestingRecord();
        this.props.history.push("/testlist");
        break;
      }
      default: console.log("Bug");
    }
  }

  checkOutOfTimeAndFulfillAnswerList(isForceSubmit) {
    const currentAnswerList = this.state.testStorage.answerList;

    if (isForceSubmit) return STATUS_OF_SUBMIT.FORCE_SUBMIT;
    else {
      const isOutOfTime = this.state.currentMinutes === "00" ? this.state.currentSeconds === "00" ? true : false : false;
      const isNotFulFill = () => {
        if (this.props.location.pathname === PATHNAME.LOGIC)
          return currentAnswerList.some(item => item.answerContent.length === 0);
        if (this.props.location.pathname === PATHNAME.ENGLISH)
          return currentAnswerList.some(item => item.answerContent === "");
      }

      if (isOutOfTime) return STATUS_OF_SUBMIT.OUT_OF_TIME;
      else {
        if (isNotFulFill()) return STATUS_OF_SUBMIT.NOT_FULFILL_ANSWER_LIST;
        else return STATUS_OF_SUBMIT.FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE;
      }
    }
  }

  showNotificationWhenDeferSubmit(status, isNotShow) {
    const newMessage = (status) => {
      if (status === "") return NOTIFICATION_MESSAGE_FOR_DEFER_SUBMIT.NO_DISPLAY;
      if (status === STATUS_OF_SUBMIT.NOT_FULFILL_ANSWER_LIST) return NOTIFICATION_MESSAGE_FOR_DEFER_SUBMIT.NOT_FULFILL_ANSWER_LIST;
      if (status === STATUS_OF_SUBMIT.FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE) return NOTIFICATION_MESSAGE_FOR_DEFER_SUBMIT.FULFILL_ANSWER_LIST_BUT_TIME_STILL_AVAILABLE;
    }

    const newNotification = {
      isShow: !isNotShow,
      message: newMessage(status)
    }

    this.setState({ notificationWhenDeferSubmit: newNotification });
  }

  saveIntervieweeTestingRecord() {
    const completeDurationTime = this.saveCompleteDurationTime();
    const { newAnswerList, totalScore } = this.props.location.state.testResult === TEST_RESULT.LOGIC && this.scoresLogicQA();

    const newTestStorage = this.props.location.state.testResult === TEST_RESULT.LOGIC ? { ...this.state.testStorage, answerList: newAnswerList, completeDurationTime, totalScore } : { ...this.state.testStorage, completeDurationTime };
    this.updateNewDataForStateAndLocalStorage(newTestStorage);
  }

  saveCompleteDurationTime() {
    if (this.isOutOfTime()) return this.state.testStorage.durationTime;
    else return this.state.testStorage.durationTime - (parseInt(this.state.currentMinutes) * 60 + parseInt(this.state.currentSeconds));
  }

  scoresLogicQA() {
    const newAnswerList = this.state.testStorage.answerList.map(result => {
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

  componentDidUpdate() {
    this.isOutOfTime() && this.submitTest(STATUS_OF_SUBMIT.OUT_OF_TIME);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.deactivateCountdownTimer();
  }

  render() {
    const testStorage = this.state.testStorage;
    const currentQA = this.state.currentQA;

    return (
      <>
        <div className={css.container}>
          <div className={css.smallContainer}>
            <MobileNavbar
              currentQA={currentQA}
              storage={testStorage}
              showMenuBar={this.showMenuBar}
            />
            <SetOfQA
              currentQA={currentQA}
              handleChange={this.handleChange}
              navigateQA={this.navigateQA}
            />
            <ControlPanel
              currentMinutes={this.state.currentMinutes}
              currentSeconds={this.state.currentSeconds}
              isBigScreen={this.state.isBigScreen}
              testStorage={testStorage}
              currentQA={currentQA}
              changeCurrentQA={this.changeCurrentQA}
              handleSubmit={this.submitTest}
            />
          </div>
          <MenuBar
            isBigScreen={this.state.isBigScreen}
            isShow={this.state.menuBar}
            currentQA={currentQA}
            testStorage={testStorage}
            currentMinutes={this.state.currentMinutes}
            currentSeconds={this.state.currentSeconds}
            changeCurrentQA={this.changeCurrentQA}
            showMenuBar={this.showMenuBar}
            handleSubmit={this.submitTest}
          />
        </div>
        <WarningNotification
          notificationWhenDeferSubmit={this.state.notificationWhenDeferSubmit}
          showNotificationWhenDeferSubmit={this.showNotificationWhenDeferSubmit}
          submitTest={this.submitTest}
        />
      </>
    )
  }
}

export default TestDetail;