import React from "react";
import { Link } from "react-router-dom";
import * as css from "./IntervieweeDetail.module.scss";

// Utils
import { formatDate } from "../../../utils/formatDate";

// Data
import interviewee from "../../../mockdata/interviewee.json";
import result from "../../../mockdata/result.json";

// Assets
import avatarLogo from "../../../assets/avatar.png";
import emotionAnonymous from "../../../assets/rating-emo/anonymous.png";
import emotionSad from "../../../assets/rating-emo/sad.png";
import emotionHeart from "../../../assets/rating-emo/heart.png";
import emotionStar from "../../../assets/rating-emo/star.png";

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
        {props.reviews}
        <Link to={`/admin/interviewee/${props.id}-${props.fullname}/${props.title}test`}>View Details!</Link>
      </div>
    </div>
  )
}

class IntervieweeDetail extends React.Component {
  constructor(props) {
    super();

    this.state = {
      detailInterviewee: {},
      limitedReviews: {
        english: "",
        logic: ""
      },
      rating: null
    };
    this.loadDetailInterviewee = this.loadDetailInterviewee.bind(this);
    this.limitLengthOfReviews = this.limitLengthOfReviews.bind(this);
    this.checkRating = this.checkRating.bind(this);
  }

  componentDidMount() {
    !sessionStorage.getItem("admin") && this.props.history.push("/admin");

    const detailInterviewee = this.loadDetailInterviewee();
    this.limitLengthOfReviews(detailInterviewee);
    this.checkValidPath(detailInterviewee);
    this.checkRating(detailInterviewee);
    this.setState({ detailInterviewee: detailInterviewee });
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

    limitedReviews.english = this.customizeReviews(detailInterviewee.resultOfEnglishTest.review);
    limitedReviews.logic = this.customizeReviews(detailInterviewee.resultOfLogicTest.review);
    this.setState({ limitedReviews });
  }

  customizeReviews(string) {
    if (string.length === 0) {
      return `You haven't reviewed this test yet!`;
    } else if (string.length > 180) {
      let newStr = string.substr(0, 180);
      if (newStr[newStr.length - 1] === " ") newStr = newStr.substr(0, newStr.length - 1);
      return `${newStr}...`;
    } else {
      return string;
    }
  }

  checkValidPath(object) {
    if (Object.keys(object).length === 0 && object.constructor === Object)
      this.props.history.push("/admin/intervieweelist");
  }

  checkRating(detailInterviewee) {
    if (detailInterviewee.resultOfEnglishTest.totalScore === null) {
      this.setState({ rating: emotionAnonymous })
    } else {
      const averageScore = (detailInterviewee.resultOfEnglishTest.totalScore + detailInterviewee.resultOfLogicTest.totalScore) / 2;
      averageScore < 6.0 ? this.setState({ rating: emotionSad }) : averageScore < 9.0 ? this.setState({ rating: emotionHeart }) : this.setState({ rating: emotionStar });
    }
  }

  render() {
    const detailInterviewee = this.state.detailInterviewee;

    return (
      <div className={css.container}>
        <div className={css.breadcrumb}>
          <Link className={css.breadcrumbLink} to={"/admin/dashboard"}>Dashboard | </Link> <Link className={css.breadcrumbLink} to={"/admin/intervieweelist"}>Interviewee List | </Link> <span>{detailInterviewee.fullname}</span>
        </div>
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
              reviews={this.state.limitedReviews.logic}
              isNotReviewYet={detailInterviewee.resultOfLogicTest && detailInterviewee.resultOfLogicTest.review.length === 0 ? true : false}
              id={detailInterviewee.id}
              fullname={detailInterviewee.fullname}
            />
            <ReviewContainer
              title="english"
              reviews={this.state.limitedReviews.english}
              isNotReviewYet={detailInterviewee.resultOfEnglishTest && detailInterviewee.resultOfEnglishTest.review.length === 0 ? true : false}
              id={detailInterviewee.id}
              fullname={detailInterviewee.fullname}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default IntervieweeDetail;