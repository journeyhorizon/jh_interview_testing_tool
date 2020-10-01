import React, { useEffect, useRef, useState } from "react";
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

const ReviewContainer = (props) => {
  const data = props.fullData;
  const rightAnswerStatistic = props.isLogicTest
    && data.resultOfLogicTest
    && Math.round(data.resultOfLogicTest.totalScore * data.resultOfLogicTest.answerList.length / 10);

  return (
    <div className={css.reviewContainer}>
      <div className={css.reviewTitle}>
        Reviews of <span>{props.title} TEST</span>
        {props.isLogicTest && <i>(Number of correct answer: {rightAnswerStatistic}/{data.resultOfLogicTest ? data.resultOfLogicTest.answerList.length : 0})</i>}
      </div>
      <div className={`${css.reviews} ${props.isNotReviewYet && css.notReviewYet}`}>
        {props.isNotReviewYet ? props.limitedReviews : props.isBigScreen ? props.fullReviews : props.limitedReviews}
        <Link to={{
          pathname: `/admin/interviewee/${data.id}-${data.fullname}/${props.title}test`,
          state: { ...data, resultTest: props.resultTest }
        }}>View Details!</Link>
      </div>
    </div>
  )
}

const IntervieweeDetail = (props) => {
  const [detailInterviewee, setDetailInterviewee] = useState({});
  const [limitedReviews, setLimitedReviews] = useState({
    english: "",
    logic: ""
  });
  const [rating, setRating] = useState(null);
  const [isBigScreen, setIsBigScreen] = useState(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    !sessionStorage.getItem("admin") && props.history.push("/admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      window.innerWidth > 1200 ? setIsBigScreen(true) : setIsBigScreen(false)
    }

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => { window.removeEventListener("resize", updateDimensions); }
  }, [])

  useEffect(() => {
    const loadDetailInterviewee = async () => {
      const intervieweeParam = {
        id: props.match.params.id,
        fullname: props.match.params.fullname
      };

      const oneInterviewee = await myApi().get("/admin/getInterviewee", { params: intervieweeParam })
        .then(response => response.data);
      const resultList = await myApi().get("/admin/getAllResult").then(response => response.data);
      const intervieweeResult = resultList.filter(item => item.intervieweeId === oneInterviewee.id)[0];

      intervieweeResult ? setDetailInterviewee({
        ...oneInterviewee,
        submitTime: formatDate(intervieweeResult.submitTime),
        resultOfEnglishTest: intervieweeResult.resultOfEnglishTest,
        resultOfLogicTest: intervieweeResult.resultOfLogicTest
      }) : setDetailInterviewee({ ...oneInterviewee })
    }

    loadDetailInterviewee();
  }, [props.match.params])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const checkInvalidPath = (object) => {
      if (Object.keys(object).length === 0 && object.constructor === Object)
        return true;
      else return false;
    }

    const limitLengthOfReviews = (detailInterviewee) => {
      const limitedReviews = {
        english: "",
        logic: ""
      };

      limitedReviews.english = customizeStringLength(detailInterviewee.resultOfEnglishTest.reviews, 150);
      limitedReviews.logic = customizeStringLength(detailInterviewee.resultOfLogicTest.reviews, 150);
      setLimitedReviews(limitedReviews);
    }

    const checkRating = (detailInterviewee) => {
      if (detailInterviewee.resultOfEnglishTest.totalScore === null) {
        setRating(emotionAnonymous);
      } else {
        const averageScore = (detailInterviewee.resultOfEnglishTest.totalScore + detailInterviewee.resultOfLogicTest.totalScore) / 2;
        averageScore < 6.0
          ? setRating(emotionSad)
          : averageScore < 9.0
            ? setRating(emotionHeart)
            : setRating(emotionStar);
      }
    }

    if (!checkInvalidPath(detailInterviewee)) {
      limitLengthOfReviews(detailInterviewee);
      checkRating(detailInterviewee);
    } else props.history.push("/admin/intervieweelist");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailInterviewee])

  return (
    <div className={css.container}>
      <Breadcrumb detailInterviewee={detailInterviewee} />
      <div className={css.profile}>
        <ProfileCard
          detailInterviewee={detailInterviewee}
          rating={rating}
        />
        <div className={css.testReview}>
          <ReviewContainer
            title="logic"
            resultTest={RESULT_OF_LOGIC_TEST_TYPE}
            limitedReviews={limitedReviews.logic}
            fullReviews={detailInterviewee.resultOfLogicTest && detailInterviewee.resultOfLogicTest.reviews}
            isNotReviewYet={detailInterviewee.resultOfLogicTest && detailInterviewee.resultOfLogicTest.reviews.length === 0 ? true : false}
            isBigScreen={isBigScreen}
            fullData={detailInterviewee}
            isLogicTest={true}
          />
          <ReviewContainer
            title="english"
            resultTest={RESULT_OF_ENGLISH_TEST_TYPE}
            limitedReviews={limitedReviews.english}
            fullReviews={detailInterviewee.resultOfEnglishTest && detailInterviewee.resultOfEnglishTest.reviews}
            isNotReviewYet={detailInterviewee.resultOfEnglishTest && detailInterviewee.resultOfEnglishTest.reviews.length === 0 ? true : false}
            isBigScreen={isBigScreen}
            fullData={detailInterviewee}
          />
        </div>
      </div>
    </div>
  )
}

export default IntervieweeDetail;