import React from "react";
import * as css from "./ReviewPageOfTest.module.scss"

// Component
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import MobileNavbar from "../../common/MobileNavbar/MobileNavbar";
import MenuBar from "../../common/MenuBar/MenuBar";
import SetOfQA from "../ReviewPageSmallComponents/SetOfQA/SetOfQA";
import ControlPanel from "../ReviewPageSmallComponents/ControlPanel/ControlPanel";
import ReviewPageWarning from "../ReviewPageWarning/ReviewPageWarning";

// Api
import myApi from "../../../api/myApi";

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

  updateDimensions() {
    if (this._isMounted)
      if (window.innerWidth > 1200) {
        this.setState({ menuBar: null });
        this.setState({ isBigScreen: true });
      } else this.setState({ isBigScreen: false });
  }

  limitLengthOfQuestionContent(currentQuestion) {
    const limitedQuestionContent = customizeStringLength(currentQuestion, 115);
    this.setState({ limitedQuestionContent });
  }

  giveReviewsAndScores({ target }) {
    const newValue = () => {
      if (target.name === "totalScore") return target.value > 10 ? 10 : parseFloat(target.value)
      else return target.value
    }

    this.setState({ resultOfTest: { ...this.state.resultOfTest, [target.name]: newValue() } });
  }

  changeCurrentQA(index) {
    this.setState({ currentQA: this.state.resultOfTest.answerList[index] });
    this.limitLengthOfQuestionContent(this.state.resultOfTest.answerList[index].questionContent);
  }

  navigateQA(step) {
    if (this.state.resultOfTest.answerList) {
      const currentIndex = this.state.resultOfTest.answerList.findIndex(item => item.id === this.state.currentQA.id);
      const newIndex = currentIndex + step;

      if (newIndex < 0) this.changeCurrentQA(this.state.resultOfTest.answerList.length - 1);
      else if (newIndex >= this.state.resultOfTest.answerList.length) this.changeCurrentQA(0);
      else this.changeCurrentQA(newIndex);
    }
  }

  showMenuBar() {
    this.setState({ menuBar: !this.state.menuBar });
  }

  async saveChanges() {
    const testResultId = await myApi().get("/admin/getResultIdByIntervieweeId", { params: { intervieweeId: this.props.match.params.id } }).then(response => response.data);
    const item = {
      id: testResultId,
      testType: this.state.testType,
      newData: this.state.resultOfTest
    }

    // eslint-disable-next-line no-unused-vars
    const newData = await myApi().post("/admin/saveIntervieweeTestRecord", item).then(response => response.data);
    this.props.history.push(`/admin/interviewee/${this.props.match.params.id}-${this.props.match.params.fullname}`);
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
            storage={resultOfTest}
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
        <MenuBar
          isAdmin={true}
          isBigScreen={this.state.isBigScreen}
          isShow={this.state.menuBar}
          detailInterviewee={detailInterviewee}
          currentQA={currentQA}
          resultOfTest={resultOfTest}
          changeCurrentQA={this.changeCurrentQA}
          showMenuBar={this.showMenuBar}
        />
        <ReviewPageWarning />
      </div>
    )
  }
}

export default ReviewPageOfTest;