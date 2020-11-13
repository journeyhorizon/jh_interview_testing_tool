import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import * as css from "./Breadcrumb.module.scss";

const BreadcrumbIntervieweeList = () => {
  return (
    <div className={css.breadcrumb}>
      <Link className={css.breadcrumbLink} to={"/admin/dashboard"}>Dashboard |&nbsp;</Link> <span>Interviewee List</span>
    </div>
  )
}

const BreadcrumbIntervieweeDetail = (props) => {
  return (
    <div className={css.breadcrumb}>
      <Link className={css.breadcrumbLink} to={"/admin/dashboard"}>Dashboard |&nbsp;</Link> <Link className={css.breadcrumbLink} to={"/admin/intervieweelist"}>Interviewee List |&nbsp;</Link> <span>{props.detailInterviewee.fullname}</span>
    </div>
  )
}

const BreadcrumbIntervieweeReviewTest = (props) => {
  return props.detailInterviewee === undefined ? "" : (
    <div className={css.breadcrumbReviewPage}>
      <Link className={css.breadcrumbReviewPageLink} to={"/admin/dashboard"}>Dashboard |&nbsp;</Link> <Link className={css.breadcrumbReviewPageLink} to={"/admin/intervieweelist"}>Interviewee List |&nbsp;</Link> <Link className={css.breadcrumbReviewPageLink} to={`/admin/interviewee/${props.detailInterviewee.id}/${props.detailInterviewee.fullname}`}>{props.detailInterviewee.fullname} |&nbsp;</Link> <span> {props.testName} Test </span>
    </div>
  )
}

const Breadcrumb = (props) => {
  return (
    <>
      <Switch>
        <Route exact path="/admin/intervieweelist" component={BreadcrumbIntervieweeList} />
        <Route exact path="/admin/interviewee/:id/:fullname">
          <BreadcrumbIntervieweeDetail detailInterviewee={props.detailInterviewee} />
        </Route>
        <Route path="/admin/interviewee/:id/:fullname/logictest">
          <BreadcrumbIntervieweeReviewTest detailInterviewee={props.detailInterviewee} testName="Logic" />
        </Route>
        <Route path="/admin/interviewee/:id/:fullname/englishtest">
          <BreadcrumbIntervieweeReviewTest detailInterviewee={props.detailInterviewee} testName="English" />
        </Route>
      </Switch>
    </>
  )
}

export default Breadcrumb;
