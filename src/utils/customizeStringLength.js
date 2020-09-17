export function customizeStringLength(string, maxLength) {
  if (string.length === 0) {
    return `You haven't reviewed this test yet!`;
  } else if (string.length > maxLength) {
    let newStr = string.substr(0, maxLength);
    if (newStr[newStr.length - 1] === " ") newStr = newStr.substr(0, newStr.length - 1);
    return `${newStr}...`;
  } else {
    return string;
  }
}