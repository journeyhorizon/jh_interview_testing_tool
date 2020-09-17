import React from "react"
import { Link } from "react-router-dom";
import * as css from "./MenuBar.module.scss";

class MenuBar extends React.Component {
  render() {
    const detailInterviewee = this.props.detailInterviewee;
    return (
      <div className={`${css.container} ${this.props.isShow === null ? "" : this.props.isShow ? css.showMenuBar : css.hideMenuBar}`}>
        <div className={css.breadcrumb}>
          <Link className={css.breadcrumbLink} to={"/admin/dashboard"}>Dashboard |&nbsp;</Link> <Link className={css.breadcrumbLink} to={"/admin/intervieweelist"}>Interviewee List |&nbsp;</Link> <Link className={css.breadcrumbLink} to={`/admin/interviewee/${detailInterviewee.id}-${detailInterviewee.fullname}`}>{detailInterviewee.fullname} |&nbsp;</Link> <span> English Test </span>
        </div>
        <div className={css.listQuestion}>
          <h3 className={css.listQuestionTitle}>List of Questions</h3>
          <div className={css.list}>
            {this.props.resultOfEnglishTest.answerList && this.props.resultOfEnglishTest.answerList.map((result, index) => (
              <div key={result.id} className={`${css.item} ${this.props.currentQA.id === result.id ? css.currentItem : ""}`} onClick={() => { this.props.changeCurrentQA(index); this.props.showMenuBar(); }}>{result.id + 1}</div>
            ))}
          </div>
        </div>
        <div className={css.closeButton} onClick={this.props.showMenuBar}>
          <h3 className={css.buttonTitle}>Close</h3>
        </div>
      </div>
    )
  }
}

export default MenuBar;