export function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (seconds < 10)
    return `${minutes}'0${seconds}"`;
  else return `${minutes}'${seconds}"`;

}