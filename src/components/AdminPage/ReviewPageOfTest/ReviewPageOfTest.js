import React, { useEffect, useState } from "react";
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

// Context
import AdminContext from "../../../context/AdminContext";

const ReviewPageOfTest = (props) => {
  const [resultOfTest, setResultOfTest] = useState({});
  const [currentQA, setCurrentQA] = useState({});
  const [testType, setTestType] = useState("");
  const [limitedQuestionContent, setLimitedQuestionContent] = useState("");
  const [isBigScreen, setIsBigScreen] = useState(false);
  const [menuBar, setMenuBar] = useState(null);

  useEffect(() => {
    !sessionStorage.getItem("admin") && props.history.push("/admin");
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
    const checkDirectAccess = () => {
      return props.location.state === undefined ? true : false;
    }

    if (!checkDirectAccess()) {
      const detailInterviewee = props.location.state;
      limitLengthOfQuestionContent(detailInterviewee[detailInterviewee.resultTest].answerList[0].questionContent);
      setTestType(detailInterviewee.resultTest);
      setCurrentQA(detailInterviewee[detailInterviewee.resultTest].answerList[0]);
      setResultOfTest({
        ...detailInterviewee[detailInterviewee.resultTest],
        totalScore: detailInterviewee[detailInterviewee.resultTest].totalScore === null
          ? 0
          : detailInterviewee[detailInterviewee.resultTest].totalScore
      });
    } else props.history.push(`/admin/interviewee/${props.match.params.id}-${props.match.params.fullname}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const limitLengthOfQuestionContent = (currentQuestion) => {
    const limitedQuestionContent = customizeStringLength(currentQuestion, 115);
    setLimitedQuestionContent(limitedQuestionContent);
  }

  const giveReviewsAndScores = ({ target }) => {
    const newValue = () => {
      if (target.name === "totalScore") return target.value > 10 ? 10 : parseFloat(target.value)
      else return target.value
    }

    setResultOfTest({
      ...resultOfTest,
      [target.name]: newValue()
    });
  }

  const changeCurrentQA = (index) => {
    setCurrentQA(resultOfTest.answerList[index]);
    limitLengthOfQuestionContent(resultOfTest.answerList[index].questionContent);
  }

  const navigateQA = (step) => {
    if (resultOfTest.answerList) {
      const currentIndex = resultOfTest.answerList.findIndex(item => item.id === currentQA.id);
      const newIndex = currentIndex + step;

      if (newIndex < 0) changeCurrentQA(resultOfTest.answerList.length - 1);
      else if (newIndex >= resultOfTest.answerList.length) changeCurrentQA(0);
      else changeCurrentQA(newIndex);
    }
  }

  const showMenuBar = () => {
    setMenuBar(!menuBar);
  }

  const saveChanges = async () => {
    const testResultId = await myApi().get(
      "/admin/getResultIdByIntervieweeId",
      { params: { intervieweeId: props.match.params.id } }
    ).then(response => response.data);

    const item = {
      id: testResultId,
      testType: testType,
      newData: resultOfTest
    }

    // eslint-disable-next-line no-unused-vars
    const newData = await myApi().post("/admin/saveIntervieweeTestRecord", item).then(response => response.data);
    props.history.push(`/admin/interviewee/${props.match.params.id}-${props.match.params.fullname}`);
  }

  const detailInterviewee = props.location.state;

  return (
    <AdminContext.Provider value={currentQA}>
      <div className={css.container}>
        <Breadcrumb detailInterviewee={detailInterviewee} />
        <div className={css.smallContainer}>
          <MobileNavbar
            showMenuBar={showMenuBar}
            currentQA={currentQA}
            storage={resultOfTest}
          />
          <SetOfQA
            isBigScreen={isBigScreen}
            limitedQuestionContent={limitedQuestionContent}
            navigateQA={navigateQA}
          />
          <ControlPanel
            resultOfTest={resultOfTest}
            detailInterviewee={detailInterviewee}
            currentQA={currentQA}
            changeCurrentQA={changeCurrentQA}
            giveReviewsAndScores={giveReviewsAndScores}
            saveChanges={saveChanges}
            disabledScoresInput={testType === "resultOfLogicTest"}
          />
        </div>
        <MenuBar
          isAdmin={true}
          isBigScreen={isBigScreen}
          isShow={menuBar}
          detailInterviewee={detailInterviewee}
          currentQA={currentQA}
          resultOfTest={resultOfTest}
          changeCurrentQA={changeCurrentQA}
          showMenuBar={showMenuBar}
        />
        <ReviewPageWarning />
      </div>
    </AdminContext.Provider>
  )
}

export default ReviewPageOfTest;