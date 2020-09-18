import React from "react";
import * as css from "./ReviewPageOfTest.module.scss"

// Component
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import MobileNavbar from "../ReviewPageSmallComponents/MobileNavbar/MobileNavbar";
import SetOfQA from "../ReviewPageSmallComponents/SetOfQA/SetOfQA";
import ControlPanel from "../ReviewPageSmallComponents/ControlPanel/ControlPanel";
import ReviewPageWarning from "../ReviewPageWarning/ReviewPageWarning";
import MenuBar from "../../common/MenuBar/MenuBar";

// Utils
import { customizeStringLength } from "../../../utils/customizeStringLength";

class ReviewPageOfTest extends React.Component {
  constructor() {
    super();

    this.state = {
      resultOfTest: {},
      currentQA: {},
      testType: "",
      limitedQuestionContent: "",
      isBigScreen: false,
      menuBar: null
    };

    this.limitLengthOfQuestionContent = this.limitLengthOfQuestionContent.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.giveReviewsAndScores = this.giveReviewsAndScores.bind(this);
    this.changeCurrentQA = this.changeCurrentQA.bind(this);
    this.navigateQA = this.navigateQA.bind(this);
    this.showMenuBar = this.showMenuBar.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    !sessionStorage.getItem("admin") && this.props.history.push("/admin");
    window.addEventListener("resize", this.updateDimensions);

    if (!this.checkDirectAccess()) {
      this.updateDimensions();

      const detailInterviewee = this.props.location.state;
      this.limitLengthOfQuestionContent(detailInterviewee[detailInterviewee.resultTest].answerList[0].questionContent);
      this.setState({ testType: detailInterviewee.resultTest });
      this.setState({ currentQA: detailInterviewee[detailInterviewee.resultTest].answerList[0] });
      this.setState({ resultOfTest: { ...detailInterviewee[detailInterviewee.resultTest], totalScore: detailInterviewee[detailInterviewee.resultTest].totalScore === null ? 0 : detailInterviewee[detailInterviewee.resultTest].totalScore } });
    } else this.props.history.push(`/admin/interviewee/${this.props.match.params.id}-${this.props.match.params.fullname}`);
  }

  checkDirectAccess() {
    return this.props.location.state === undefined ? true : false;
  }

  limitLengthOfQuestionContent(currentQuestion) {
    const limitedQuestionContent = customizeStringLength(currentQuestion, 115);
    this.setState({ limitedQuestionContent });
  }

  updateDimensions() {
    if (this._isMounted)
      if (window.innerWidth > 1200) {
        this.setState({ menuBar: null });
        this.setState({ isBigScreen: true });
      } else this.setState({ isBigScreen: false });
  }

  giveReviewsAndScores(event) {
    this.setState({ resultOfTest: { ...this.state.resultOfTest, [event.target.name]: event.target.value } });
  }

  changeCurrentQA(index) {
    this.setState({ currentQA: this.state.resultOfTest.answerList[index] });
    this.limitLengthOfQuestionContent(this.state.resultOfTest.answerList[index].questionContent);
  }

  navigateQA(step) {
    if (this.state.resultOfTest.answerList) {
      const currentIndex = this.state.resultOfTest.answerList.findIndex(item => item.id === this.state.currentQA.id);
      const newIndex = currentIndex + step;

      if (newIndex < 0) {
        this.setState({ currentQA: this.state.resultOfTest.answerList[this.state.resultOfTest.answerList.length - 1] });
        this.limitLengthOfQuestionContent(this.state.resultOfTest.answerList[this.state.resultOfTest.answerList.length - 1].questionContent);
      } else if (newIndex >= this.state.resultOfTest.answerList.length) {
        this.setState({ currentQA: this.state.resultOfTest.answerList[0] });
        this.limitLengthOfQuestionContent(this.state.resultOfTest.answerList[0].questionContent);
      } else {
        this.setState({ currentQA: this.state.resultOfTest.answerList[newIndex] });
        this.limitLengthOfQuestionContent(this.state.resultOfTest.answerList[newIndex].questionContent);
      }
    }
  }

  showMenuBar() {
    this.setState({ menuBar: !this.state.menuBar });
  }

  saveChanges() {
    console.log(this.state.resultOfTest.reviews, this.state.resultOfTest.totalScore);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const detailInterviewee = this.props.location.state;
    const resultOfTest = this.state.resultOfTest;
    const currentQA = this.state.currentQA;
    const testType = this.state.testType;

    return (
      <div className={css.container}>
        <Breadcrumb detailInterviewee={detailInterviewee} />
        <div className={css.smallContainer}>
          <MobileNavbar
            showMenuBar={this.showMenuBar}
            currentQA={currentQA}
            resultOfTest={resultOfTest}
          />
          <SetOfQA
            isBigScreen={this.state.isBigScreen}
            currentQA={currentQA}
            limitedQuestionContent={this.state.limitedQuestionContent}
            navigateQA={this.navigateQA}
          />
          <ControlPanel
            resultOfTest={resultOfTest}
            detailInterviewee={detailInterviewee}
            currentQA={currentQA}
            changeCurrentQA={this.changeCurrentQA}
            giveReviewsAndScores={this.giveReviewsAndScores}
            saveChanges={this.saveChanges}
            disabledScoresInput={testType === "resultOfLogicTest"}
          />
        </div>
        <MenuBar isBigScreen={this.state.isBigScreen} isShow={this.state.menuBar} detailInterviewee={detailInterviewee} currentQA={currentQA} resultOfTest={resultOfTest} changeCurrentQA={this.changeCurrentQA} showMenuBar={this.showMenuBar} />
        <ReviewPageWarning />
      </div>
    )
  }
}

export default ReviewPageOfTest;