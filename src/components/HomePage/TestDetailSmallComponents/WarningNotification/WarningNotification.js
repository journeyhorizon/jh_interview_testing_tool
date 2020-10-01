import React from "react";
import * as css from "./WarningNotification.module.scss";

// Assets
import warning from "../../../../assets/icons/warning.png";

const WarningNotification = (props) => {
  const { isShow, message } = props.notificationWhenDeferSubmit;

  return (
    <div className={`${css.warningNotification} ${isShow && css.showWarning}`}>
      <div className={css.warningBox}>
        <div className={css.warningTitle}> Warning Notification </div>
        <div className={css.closeButton} onClick={() => props.showNotificationWhenDeferSubmit("", true)}>x</div>
        <div className={css.warningContent}>{message}</div>
        <img className={css.warningImage} src={warning} alt="warning" />
        <div className={css.submitButton} onClick={() => props.submitTest(true)}> Continue without checking </div>
      </div>
    </div>
  )
}

export default WarningNotification;