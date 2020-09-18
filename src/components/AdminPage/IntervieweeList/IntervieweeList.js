import React from "react";
import { Link } from "react-router-dom"
import * as css from "./IntervieweeList.module.scss";

// Component
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

// Utils
import { formatDate } from "../../../utils/formatDate";

// Data
import interviewee from "../../../mockdata/interviewee.json";
import result from "../../../mockdata/result.json";

function EachInterviewee(props) {
  return (
    <>
      <div className={css.order}>{props.index + 1}</div>
      <div className={css.name}>{props.result.fullname}</div>
      <div className={css.phone}>{props.result.phone}</div>
      <div className={css.email}>{props.result.email}</div>
      <div className={css.time}>{props.result.submitTime}</div>
    </>
  )
}

class IntervieweeList extends React.Component {
  constructor() {
    super();

    this.state = { fullDetailIntervieweeList: [] }
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    !sessionStorage.getItem("admin") && this.props.history.push("/admin");
    this.loadData();
  }

  loadData() {
    const list = [];
    interviewee.map(eachInterviewee => {
      const intervieweeResult = result.filter(_result => _result.intervieweeId === eachInterviewee.id)[0];
      intervieweeResult === undefined ?
        list.push({ ...eachInterviewee, submitTime: "", isValid: false }) :
        list.push({
          ...eachInterviewee,
          submitTime: formatDate(intervieweeResult.submitTime),
          isValid: true
        });
      return null
    })
    this.setState({ fullDetailIntervieweeList: list });
  }

  render() {
    return (
      <div id="intervieweeListContainer" className={css.container} >
        <Breadcrumb />
        <div className={css.table}>
          <div className={css.tableTitle}>List of Interviewees</div>
          <div className={css.tableList}>
            {this.state.fullDetailIntervieweeList.map((result, index) => (
              result.isValid ?
                <Link key={result.id} className={css.item} to={`/admin/interviewee/${result.id}-${result.fullname}`} style={{ borderBottom: index === this.state.fullDetailIntervieweeList.length - 1 && "none" }}>
                  <EachInterviewee index={index} result={result} />
                </Link> :
                <div key={result.id} className={css.item} style={{ borderBottom: index === this.state.fullDetailIntervieweeList.length - 1 && "none" }}>
                  <EachInterviewee index={index} result={result} />
                </div>
            ))}
          </div>
          <div className={css.tableStatistic}>
            <div className={css.categoryName}>Total of Interviewee</div>
            <div className={css.categoryValue}>{this.state.fullDetailIntervieweeList.length}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default IntervieweeList;