import React from "react";
import { Link } from "react-router-dom"
import * as css from "./IntervieweeList.module.scss";

// Component
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

// Api
import myApi from "../../../api/myApi";

// Utils
import { formatDate } from "../../../utils/formatDate";

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
  }

  componentDidMount() {
    !sessionStorage.getItem("admin") && this.props.history.push("/admin");
    this.loadData();
  }

  async loadData() {
    const intervieweeList = await myApi().get("/admin/getAllInterviewee").then(response => response.data);
    const resultList = await myApi().get("/admin/getAllResult").then(response => response.data);

    const fullDetailIntervieweeList = this.customizeData(intervieweeList, resultList);
    this.setState({ fullDetailIntervieweeList });
  }

  customizeData(intervieweeList, resultList) {
    return intervieweeList.map(eachInterviewee => {
      const intervieweeResult = resultList.filter(item => item.intervieweeId === eachInterviewee.id)[0];
      if (intervieweeResult === undefined) {
        return { ...eachInterviewee, submitTime: "", isValid: false };
      } else {
        return {
          ...eachInterviewee,
          submitTime: formatDate(intervieweeResult.submitTime),
          isValid: true
        }
      }
    });
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