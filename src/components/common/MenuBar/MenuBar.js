import React from "react"
import { Route, Link } from "react-router-dom";
import * as css from "./MenuBar.module.scss";

// Component
import ControlPanelHandleButton from "../ControlPanelHandleButton/ControlPanelHandleButton";
import CountdownTimer from "../../HomePage/TestDetailSmallComponents/ControlPanel/CountdownTimer/CountdownTimer";
import ListQuestion from "../../HomePage/TestDetailSmallComponents/ControlPanel/ListQuestion/ListQuestion";

function AdminMenuBar(props) {
  const detailInterviewee = props.detailInterviewee;

  return detailInterviewee === undefined ? "" : (
    <div className={`${css.container} ${props.isBigScreen ? "" : props.isShow === null ? "" : props.isShow ? css.showMenuBar : css.hideMenuBar}`}>
      <div className={css.breadcrumb}>
        <Route path="/admin/interviewee/:id-:fullname/logictest">
          <Link className={css.breadcrumbLink} to={"/admin/dashboard"}>Dashboard |&nbsp;</Link> <Link className={css.breadcrumbLink} to={"/admin/intervieweelist"}>Interviewee List |&nbsp;</Link> <Link className={css.breadcrumbLink} to={`/admin/interviewee/${detailInterviewee.id}-${detailInterviewee.fullname}`}>{detailInterviewee.fullname} |&nbsp;</Link> <span> Logic Test </span>
        </Route>
        <Route path="/admin/interviewee/:id-:fullname/englishtest">
          <Link className={css.breadcrumbLink} to={"/admin/dashboard"}>Dashboard |&nbsp;</Link> <Link className={css.breadcrumbLink} to={"/admin/intervieweelist"}>Interviewee List |&nbsp;</Link> <Link className={css.breadcrumbLink} to={`/admin/interviewee/${detailInterviewee.id}-${detailInterviewee.fullname}`}>{detailInterviewee.fullname} |&nbsp;</Link> <span> English Test </span>
        </Route>
      </div>
      <div className={css.listQuestion}>
        <h3 className={css.listQuestionTitle}>List of Questions</h3>
        <div className={css.list}>
          {props.resultOfTest.answerList && props.resultOfTest.answerList.map((result, index) => (
            <div key={result.id} className={`${css.item} ${props.currentQA.id === result.id ? css.currentItem : ""}`} onClick={() => { props.changeCurrentQA(index); props.showMenuBar(); }}>{result.id + 1}</div>
          ))}
        </div>
      </div>
      <ControlPanelHandleButton handleClick={props.showMenuBar} typeOfHandleButton="Close" />
    </div>
  )
}

function HomeMenuBar(props) {
  return (
    <div className={`${css.container} ${props.isBigScreen ? "" : props.isShow === null ? "" : props.isShow ? css.showMenuBar : css.hideMenuBar}`}>
      <CountdownTimer
        currentMinutes={props.currentMinutes}
        currentSeconds={props.currentSeconds}
      />
      <ListQuestion
        testStorage={props.testStorage}
        currentQA={props.currentQA}
        changeCurrentQA={props.changeCurrentQA}
        showMenuBar={props.showMenuBar}
      />
      <div className={css.buttonGroup}>
        <ControlPanelHandleButton handleClick={props.showMenuBar} typeOfHandleButton="Close" />
        <ControlPanelHandleButton handleClick={props.handleSubmit} typeOfHandleButton="Submit test" />
      </div>
    </div>
  )
}

class MenuBar extends React.Component {
  render() {
    if (this.props.isAdmin)
      return (
        <AdminMenuBar
          detailInterviewee={this.props.detailInterviewee}
          isBigScreen={this.props.isBigScreen}
          isShow={this.props.isShow}
          resultOfTest={this.props.resultOfTest}
          currentQA={this.props.currentQA}
          showMenuBar={this.props.showMenuBar}
          changeCurrentQA={this.props.changeCurrentQA}
        />
      );
    else return (
      <HomeMenuBar
        isBigScreen={this.props.isBigScreen}
        isShow={this.props.isShow}
        currentQA={this.props.currentQA}
        testStorage={this.props.testStorage}
        currentMinutes={this.props.currentMinutes}
        currentSeconds={this.props.currentSeconds}
        changeCurrentQA={this.props.changeCurrentQA}
        showMenuBar={this.props.showMenuBar}
        handleSubmit={this.props.handleSubmit}
      />
    )
  }
}

export default MenuBar;