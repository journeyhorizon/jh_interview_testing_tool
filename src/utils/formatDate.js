function getWeekday(date) {
  switch (date) {
    case 0: return "Sun";
    case 1: return "Mon";
    case 2: return "Tue";
    case 3: return "Wed";
    case 4: return "Thu";
    case 5: return "Fri";
    case 6: return "Sat";
    default: return "";
  }
}

function getDay(date) {
  if (date < 10) return `0${date}`;
  else return `${date}`;
}

function getMonth(date) {
  switch (date) {
    case 0: return "01";
    case 1: return "02";
    case 2: return "03";
    case 3: return "04";
    case 4: return "05";
    case 5: return "06";
    case 6: return "07";
    case 7: return "08";
    case 8: return "09";
    case 9: return "10";
    case 10: return "11";
    case 11: return "12";
    default: return "";
  }
}

export function formatDate(date) {
  const ago = new Date() - new Date(date);

  const totalSeconds = Math.floor(ago / 1000);
  const days = Math.floor(totalSeconds / 3600 / 24);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  if (days > 7) {
    const submitDate = new Date(date);
    return `${getWeekday(submitDate.getDay())} ${getDay(submitDate.getDate())}.${getMonth(submitDate.getMonth())}.${submitDate.getFullYear()}`;
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