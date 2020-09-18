import React from "react";
import { Link } from "react-router-dom";
import * as css from "./IntervieweeDetail.module.scss";

// Component
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

// Utils
import { formatDate } from "../../../utils/formatDate";
import { customizeStringLength } from "../../../utils/customizeStringLength";

// Data
import interviewee from "../../../mockdata/interviewee.json";
import result from "../../../mockdata/result.json";

// Assets
import avatarLogo from "../../../assets/avatar.png";
import emotionAnonymous from "../../../assets/rating-emo/anonymous.png";
import emotionSad from "../../../assets/rating-emo/sad.png";
import emotionHeart from "../../../assets/rating-emo/heart.png";
import emotionStar from "../../../assets/rating-emo/star.png";

// ALIAS
const RESULT_OF_ENGLISH_TEST_TYPE = "resultOfEnglishTest";
const RESULT_OF_LOGIC_TEST_TYPE = "resultOfLogicTest";

function ScoreContainer(props) {
  return (
    <div className={css.statisticsCategory}>
      <div className={css.title}>{props.title}</div>
      <div className={css.value}>{props.scores || ""}</div>
    </div>
  )
}

function ReviewContainer(props) {
  return (
    <div className={css.reviewContainer}>
      <div className={css.reviewTitle}>Reviews of <span>{props.title} TEST</span></div>
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
    this.loadDetailInterviewee = this.loadDetailInterviewee.bind(this);
    this.limitLengthOfReviews = this.limitLengthOfReviews.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.checkRating = this.checkRating.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    !sessionStorage.getItem("admin") && this.props.history.push("/admin");
    window.addEventListener("resize", this.updateDimensions);

    const detailInterviewee = this.loadDetailInterviewee();
    if (!this.checkInvalidPath(detailInterviewee)) {
      this.updateDimensions();
      this.limitLengthOfReviews(detailInterviewee);
      this.checkRating(detailInterviewee);
      this.setState({ detailInterviewee: detailInterviewee });
    } else this.props.history.push("/admin/intervieweelist");
  }

  loadDetailInterviewee() {
    return interviewee.reduce((neccessaryInterview, eachInterviewee) => {
      if (eachInterviewee.id === parseInt(this.props.match.params.id) && eachInterviewee.fullname === this.props.match.params.fullname) {
        const intervieweeResult = result.filter(item => item.intervieweeId === eachInterviewee.id)[0];
        neccessaryInterview = {
          ...eachInterviewee,
          submitTime: formatDate(intervieweeResult.submitTime),
          resultOfEnglishTest: intervieweeResult.resultOfEnglishTest,
          resultOfLogicTest: intervieweeResult.resultOfLogicTest
        };
      }
      return neccessaryInterview;
    }, {});
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

  updateDimensions() {
    if (this._isMounted)
      window.innerWidth > 1200 ? this.setState({ isBigScreen: true }) : this.setState({ isBigScreen: false })
  }

  checkInvalidPath(object) {
    if (Object.keys(object).length === 0 && object.constructor === Object)
      return true;
    else return false;
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
          <div className={css.profileCard}>
            <div className={css.cardTitle}>Personal Information</div>
            <div className={css.personalInformation}>
              <div className={css.avatar}>
                <img src={avatarLogo} alt="avatar" />
              </div>
              <div className={css.detail}>
                <div className={css.basicInformation}>
                  <div className={css.fullname}>{detailInterviewee.fullname}</div>
                  <div className={css.email}>{detailInterviewee.email}</div>
                  <div className={css.phone}>{detailInterviewee.phone}</div>
                </div>
                <div className={css.statistics}>
                  <ScoreContainer title="Logic" scores={detailInterviewee.resultOfLogicTest ? detailInterviewee.resultOfLogicTest.totalScore : null} />
                  <ScoreContainer title="English" scores={detailInterviewee.resultOfEnglishTest ? detailInterviewee.resultOfEnglishTest.totalScore : null} />
                  <div className={css.statisticsCategory}>
                    <div className={css.title}>Rating</div>
                    <img src={this.state.rating} alt="rating" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={css.testReview}>
            <ReviewContainer
              title="logic"
              resultTest={RESULT_OF_LOGIC_TEST_TYPE}
              limitedReviews={this.state.limitedReviews.logic}
              fullReviews={detailInterviewee.resultOfLogicTest && detailInterviewee.resultOfLogicTest.reviews}
              isNotReviewYet={detailInterviewee.resultOfLogicTest && detailInterviewee.resultOfLogicTest.reviews.length === 0 ? true : false}
              isBigScreen={this.state.isBigScreen}
              fullData={detailInterviewee}
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