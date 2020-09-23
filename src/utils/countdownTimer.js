function formatTime(time) {
  return time < 10 ? `0${time}` : `${time}`;
}

export function countdownTimer(startTime, testDurationTime) {
  const deadlineTime = new Date(new Date(startTime).getTime() + testDurationTime * 1000);
  const currentTime = new Date();

  const totalSeconds = (deadlineTime - currentTime) / 1000;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds) % 60;


  if (minutes < 0 || seconds < 0)
    return { minutes: `00`, seconds: `00` };
  else return { minutes: formatTime(minutes), seconds: formatTime(seconds) };
}
