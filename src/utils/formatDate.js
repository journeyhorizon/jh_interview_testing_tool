export function formatDate(date) {
  const ago = new Date() - new Date(date);

  const totalSeconds = Math.floor(ago / 1000);
  const days = Math.floor(totalSeconds / 3600 / 24);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  if (days > 7) {
    return new Date(date).toDateString()
  } else if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) {
        return `${seconds} seconds ago`;
      } else {
        return `${minutes} minutes ago`;
      }
    } else {
      return `${hours} hours ago`;
    }
  } else {
    return `${days} days ago`;
  }
}