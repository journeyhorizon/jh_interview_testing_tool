import React, { useContext } from "react";
import * as css from "./CountdownTimer.module.scss";

// Context
import HomeContext from "../../../../../context/HomeContext";

const CountdownTimer = () => {
  const { currentMinutes, currentSeconds } = useContext(HomeContext);

  return (
    <div className={css.countdownTimer}>
      <h3 className={css.countdownTimerTitle}>Countdown Timer</h3>
      <div className={css.countdownTimerDisplay}>
        <div className={css.timerCountingSet}>
          <div className={css.timerCountingSet_countingNumber}>{currentMinutes}</div>
          <p className={css.timerCountingSet_unit}>MINUTES</p>
        </div>
        <div className={css.gapBetweenTwoCountingNumber}>:</div>
        <div className={css.timerCountingSet}>
          <div className={css.timerCountingSet_countingNumber}>{currentSeconds}</div>
          <p className={css.timerCountingSet_unit}>SECONDS</p>
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer;