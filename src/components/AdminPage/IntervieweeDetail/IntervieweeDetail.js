import React from "react";
import { Link } from "react-router-dom";
import * as css from "./IntervieweeDetail.module.scss";

// Component
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import ProfileCard from "./ProfileCard/ProfileCard";

// Api
import myApi from "../../../api/myApi";

// Utils
import { formatDate } from "../../../utils/formatDate";
import { customizeStringLength } from "../../../utils/customizeStringLength";

// Assets
import emotionAnonymous from "../../../assets/rating-emo/anonymous.png";
import emotionSad from "../../../assets/rating-emo/sad.png";
import emotionHeart from "../../../assets/rating-emo/heart.png";
import emotionStar from "../../../assets/rating-emo/star.png";

// ALIAS
const RESULT_OF_ENGLISH_TEST_TYPE = "resultOfEnglishTest";
const RESULT_OF_LOGIC_TEST_TYPE = "resultOfLogicTest";

function ReviewContainer(props) {
  const data = props.fullData;
  const rightAnsStatistic = props.isLogicTest && data.resultOfLogicTest && Math.round(data.resultOfLogicTest.totalScore * data.resultOfLogicTest.answerList.length / 10);

  return (
    <div className={css.reviewContainer}>
      <div className={css.reviewTitle}>Reviews of <span>{props.title} TEST</span> {props.isLogicTest && <i>(Number of correct answer: {rightAnsStatistic}/{data.resultOfLogicTest ? data.resultOfLogicTest.answerList.length : 0})</i>} </div>
      <div className={`${css.reviews} ${props.isNotReviewYet && css.notReviewYet}`}>
        {props.isNotReviewYet ? props.limitedReviews : props.isBigScreen ? props.fullReviews : props.limitedReviews}
        <Link to={{
          pathname: `/admin/interviewee/${props.fullData.id}-${props.fullData.fullname}/${props.title}test`,
          state: { ...props.fullData, resultTest: props.resultTest }
        }}>View Details!</Link>
      </div>
    </div>
  )
}

class IntervieweeDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      detailInterviewee: {},
      limitedReviews: {
        english: "",
        logic: ""
      },
      rating: null,
      isBigScreen: null
    };
  }

  async componentDidMount() {
    this._isMounted = true;

    !sessionStorage.getItem("admin") && this.props.history.push("/admin");
    window.addEventListener("resize", this.updateDimensions);

    const detailInterviewee = await this.loadDetailInterviewee();
    if (!this.checkInvalidPath(detailInterviewee)) {
      this.updateDimensions();
      this.limitLengthOfReviews(detailInterviewee);
      this.checkRating(detailInterviewee);
      this.setState({ detailInterviewee: detailInterviewee });
    } else this.props.history.push("/admin/intervieweelist");
  }

  async loadDetailInterviewee() {
    const intervieweeParam = {
      id: this.props.match.params.id,
      fullname: this.props.match.params.fullname
    };

    const oneInterviewee = await myApi().get("/admin/getInterviewee", { params: intervieweeParam }).then(response => response.data);
    const resultList = await myApi().get("/admin/getAllResult").then(response => response.data);
    const intervieweeResult = resultList.filter(item => item.intervieweeId === oneInterviewee.id)[0];

    return {
      ...oneInterviewee,
      submitTime: formatDate(intervieweeResult.submitTime),
      resultOfEnglishTest: intervieweeResult.resultOfEnglishTest,
      resultOfLogicTest: intervieweeResult.resultOfLogicTest
    };
  }

  checkInvalidPath(object) {
    if (Object.keys(object).length === 0 && object.constructor === Object)
      return true;
    else return false;
  }

  updateDimensions() {
    if (this._isMounted)
      window.innerWidth > 1200 ? this.setState({ isBigScreen: true }) : this.setState({ isBigScreen: false })
  }

  limitLengthOfReviews(detailInterviewee) {
    const limitedReviews = {
      english: "",
      logic: ""
    }

    limitedReviews.english = customizeStringLength(detailInterviewee.resultOfEnglishTest.reviews, 150);
    limitedReviews.logic = customizeStringLength(detailInterviewee.resultOfLogicTest.reviews, 150);
    this.setState({ limitedReviews });
  }

  checkRating(detailInterviewee) {
    if (detailInterviewee.resultOfEnglishTest.totalScore === null) {
      this.setState({ rating: emotionAnonymous })
    } else {
      const averageScore = (detailInterviewee.resultOfEnglishTest.totalScore + detailInterviewee.resultOfLogicTest.totalScore) / 2;
      averageScore < 6.0 ? this.setState({ rating: emotionSad }) : averageScore < 9.0 ? this.setState({ rating: emotionHeart }) : this.setState({ rating: emotionStar });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const detailInterviewee = this.state.detailInterviewee;

    return (
      <div className={css.container}>
        <Breadcrumb detailInterviewee={detailInterviewee} />
        <div className={css.profile}>
          <ProfileCard
            detailInterviewee={detailInterviewee}
            rating={this.state.rating}
          />
          <div className={css.testReview}>
            <ReviewContainer
              title="logic"
              resultTest={RESULT_OF_LOGIC_TEST_TYPE}
              limitedReviews={this.state.limitedReviews.logic}
              fullReviews={detailInterviewee.resultOfLogicTest && detailInterviewee.resultOfLogicTest.reviews}
              isNotReviewYet={detailInterviewee.resultOfLogicTest && detailInterviewee.resultOfLogicTest.reviews.length === 0 ? true : false}
              isBigScreen={this.state.isBigScreen}
              fullData={detailInterviewee}
              isLogicTest={true}
            />
            <ReviewContainer
              title="english"
              resultTest={RESULT_OF_ENGLISH_TEST_TYPE}
              limitedReviews={this.state.limitedReviews.english}
              fullReviews={detailInterviewee.resultOfEnglishTest && detailInterviewee.resultOfEnglishTest.reviews}
              isNotReviewYet={detailInterviewee.resultOfEnglishTest && detailInterviewee.resultOfEnglishTest.reviews.length === 0 ? true : false}
              isBigScreen={this.state.isBigScreen}
              fullData={detailInterviewee}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default IntervieweeDetail;