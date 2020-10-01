import React, { useRef } from "react";
import * as css from "./ReviewPageWarning.module.scss";

const ReviewPageWarning = () => {
  const containerRef = useRef();

  const closeWarning = () => {
    containerRef.current.style.display = "none";
  }

  return (
    <div ref={containerRef} className={css.container}>
      <div className={css.warningText}>
        If you want to write down your reviews or scores for this interviewee, please visit us on a bigger screen (laptop, PC)
        </div>
      <div className={css.closeButton} onClick={closeWarning}>
        Get it. Go through!
        </div>
    </div>
  )
}

export default ReviewPageWarning;