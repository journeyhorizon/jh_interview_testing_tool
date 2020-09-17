import React from "react";
import { Link } from "react-router-dom";
import * as css from "./ReviewPageOfEnglishTest.module.scss"

// Component
import ReviewPageWarning from "../../common/ReviewPageWarning/ReviewPageWarning";
import MenuBar from "../../common/MenuBar/MenuBar";

// Utils
import { formatTime } from "../../../utils/formatTime";
import { customizeStringLength } from "../../../utils/customizeStringLength";

// Assets
import menu from "../../../assets/icons/menu.png"
import arrowRight from "../../../assets/icons/arrow-right.png"
import arrowLeft from "../../../assets/icons/arrow-left.png"

class ReviewPageOfEnglishTest extends React.Component {
  constructor() {
    super();

    this.state = {
      resultOfEnglishTest: {},
      currentQA: {},
      limitedQuestionContent: "",
      isBigScreen: false,
      menuBar: null
    };

    this.limitLengthOfQuestionContent = this.limitLengthOfQuestionContent.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.giveScoresAndScores = this.giveScoresAndScores.bind(this);
    this.changeCurrentQA = this.changeCurrentQA.bind(this);
    this.navigateQA = this.navigateQA.bind(this);
    this.showMenuBar = this.showMenuBar.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount() {
    console.log("review mount");
    this._isMounted = true;

    !sessionStorage.getItem("admin") && this.props.history.push("/admin");
    window.addEventListener("resize", this.updateDimensions);

    if (!this.checkDirectAccess()) {
      this.updateDimensions();

      const detailInterviewee = this.props.location.state;
      this.limitLengthOfQuestionContent(detailInterviewee.resultOfEnglishTest.answerList[0].questionContent);
      this.setState({ currentQA: detailInterviewee.resultOfEnglishTest.answerList[0] });
      this.setState({ resultOfEnglishTest: { ...detailInterviewee.resultOfEnglishTest, totalScore: detailInterviewee.resultOfEnglishTest.totalScore === null ? 0 : detailInterviewee.resultOfEnglishTest.totalScore } });
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
      window.innerWidth > 1200 ? this.setState({ isBigScreen: true }) : this.setState({ isBigScreen: false })
  }

  giveScoresAndScores(event) {
    this.setState({ resultOfEnglishTest: { ...this.state.resultOfEnglishTest, [event.target.name]: event.target.value } });
  }

  changeCurrentQA(index) {
    this.setState({ currentQA: this.state.resultOfEnglishTest.answerList[index] });
    this.limitLengthOfQuestionContent(this.state.resultOfEnglishTest.answerList[index].questionContent);
  }

  navigateQA(step) {
    if (this.state.resultOfEnglishTest.answerList) {
      const currentIndex = this.state.resultOfEnglishTest.answerList.findIndex(item => item.id === this.state.currentQA.id);
      const newIndex = currentIndex + step;

      if (newIndex < 0) {
        this.setState({ currentQA: this.state.resultOfEnglishTest.answerList[this.state.resultOfEnglishTest.answerList.length - 1] });
        this.limitLengthOfQuestionContent(this.state.resultOfEnglishTest.answerList[this.state.resultOfEnglishTest.answerList.length - 1].questionContent);
      } else if (newIndex >= this.state.resultOfEnglishTest.answerList.length) {
        this.setState({ currentQA: this.state.resultOfEnglishTest.answerList[0] });
        this.limitLengthOfQuestionContent(this.state.resultOfEnglishTest.answerList[0].questionContent);
      } else {
        this.setState({ currentQA: this.state.resultOfEnglishTest.answerList[newIndex] });
        this.limitLengthOfQuestionContent(this.state.resultOfEnglishTest.answerList[newIndex].questionContent);
      }
    }
  }

  showMenuBar() {
    this.setState({ menuBar: !this.state.menuBar });
  }

  saveChanges() {
    console.log(this.state.resultOfEnglishTest.reviews, this.state.resultOfEnglishTest.totalScore);
  }

  componentWillUnmount() {
    console.log("review unmount")
    this._isMounted = false;
  }

  render() {
    const detailInterviewee = this.props.location.state;
    const resultOfEnglishTest = this.state.resultOfEnglishTest;
    const currentQA = this.state.currentQA;

    return (
      <div className={css.container}>
        <div className={css.breadcrumb}>
          <Link className={css.breadcrumbLink} to={"/admin/dashboard"}>Dashboard |&nbsp;</Link> <Link className={css.breadcrumbLink} to={"/admin/intervieweelist"}>Interviewee List |&nbsp;</Link> <Link className={css.breadcrumbLink} to={`/admin/interviewee/${detailInterviewee.id}-${detailInterviewee.fullname}`}>{detailInterviewee.fullname} |&nbsp;</Link> <span> English Test </span>
        </div>
        <div className={css.smallContainer}>
          <div className={css.mobileNavbar}>
            <div className={css.menuButton} onClick={this.showMenuBar}>
              <img src={menu} alt="menu" />
            </div>
            <div className={css.orderOfCurrentPage}><span>{currentQA.id + 1 || 0}</span>/{resultOfEnglishTest.answerList && resultOfEnglishTest.answerList.length}</div>
          </div>
          <div className={css.setOfQA}>
            <h3 className={css.currentQuestion}>Question: <span>{this.state.isBigScreen ? currentQA.questionContent : this.state.limitedQuestionContent}</span></h3>
            <textarea className={css.currentAnswer} value={currentQA.answerContent} readOnly={true} />
            <div className={css.navigation}>
              <div className={css.arrowButton} onClick={() => this.navigateQA(-1)}>
                <img src={arrowLeft} alt="arrow left navigation" />
              </div>
              <div className={css.arrowButton} onClick={() => this.navigateQA(1)}>
                <img src={arrowRight} alt="arrow right navigation" />
              </div>
            </div>
          </div>
          <div className={css.controlPanel}>
            <div className={css.listQuestion}>
              <h3 className={css.listQuestionTitle}>List of Questions</h3>
              <div className={css.list}>
                {resultOfEnglishTest.answerList && resultOfEnglishTest.answerList.map((result, index) => (
                  <div key={result.id} className={`${css.item} ${this.state.currentQA.id === result.id ? css.currentItem : ""}`} onClick={() => this.changeCurrentQA(index)}>{result.id + 1}</div>
                ))}
              </div>
            </div>
            <div className={css.timeDisplay}>
              <div className={css.submitTime}>Submit time: <span>{detailInterviewee.submitTime || ""}</span></div>
              <div className={css.durationTime}>Duration time: <span>{formatTime(resultOfEnglishTest.completeDurationTime)}</span> (total: <span>{formatTime(resultOfEnglishTest.durationTime)}</span>)</div>
            </div>
            <div className={css.reviews}>
              <h3 className={css.reviewsTitle}>Reviews</h3>
              <textarea className={css.reviewsContent} name="reviews" value={resultOfEnglishTest.reviews} placeholder={"Write down your reviews here..."} onChange={this.giveScoresAndScores} />
            </div>
            <div className={css.scores}>
              <h3 className={css.scoresTitle}>Scores</h3>
              <input className={css.scoresValue} type="number" name="totalScore" step={0.1} min={0} max={10} value={resultOfEnglishTest.totalScore || 0} onChange={this.giveScoresAndScores} />
            </div>
            <div className={css.saveButton} onClick={this.saveChanges}>
              <h3 className={css.buttonTitle}>Save changes</h3>
            </div>
          </div>
        </div>
        <MenuBar isShow={this.state.menuBar} detailInterviewee={detailInterviewee} currentQA={currentQA} resultOfEnglishTest={resultOfEnglishTest} changeCurrentQA={this.changeCurrentQA} showMenuBar={this.showMenuBar} />
        <ReviewPageWarning />
      </div>
    )
  }
}

export default ReviewPageOfEnglishTest;