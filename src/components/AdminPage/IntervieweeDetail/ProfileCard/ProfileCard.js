import React from "react";
import * as css from "./ProfileCard.module.scss";

// Assets
import avatarLogo from "../../../../assets/avatar.png";

function ScoreContainer(props) {
  return (
    <div className={css.statisticsCategory}>
      <div className={css.title}>{props.title}</div>
      <div className={css.value}>{props.scores !== null ? props.scores : ""}</div>
    </div>
  )
}

class ProfileCard extends React.Component {
  render() {
    const detailInterviewee = this.props.detailInterviewee;

    return (
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
              <ScoreContainer
                title="Logic"
                scores={detailInterviewee.resultOfLogicTest ? detailInterviewee.resultOfLogicTest.totalScore : null}
              />
              <ScoreContainer
                title="English"
                scores={detailInterviewee.resultOfEnglishTest ? detailInterviewee.resultOfEnglishTest.totalScore : null}
              />
              <div className={css.statisticsCategory}>
                <div className={css.title}>Rating</div>
                <img src={this.props.rating} alt="rating" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileCard;