const QUESTION_TYPE = {
  WH: "WH",
  SINGLE_CHOICE: "SINGLE_CHOICE",
  MULTIPLE_CHOICES: "MULTIPLE_CHOICES"
};

function createObjectForSavingResultOfTest(randomIndex, data) {
  const { questionList, ...basicInformationOfTest } = data[randomIndex];
  const answerList = questionList.map(item => {
    if (item.type === QUESTION_TYPE.WH) {
      item.answerContent = "";
    } else if (item.type === QUESTION_TYPE.SINGLE_CHOICE || item.type === QUESTION_TYPE.MULTIPLE_CHOICES) {
      item.answerContent = [];
      item.point = null;
    }

    return item;
  })

  const resultOfTest = {
    ...basicInformationOfTest,
    answerList,
    completeDurationTime: 0,
    reviews: "",
    totalScore: null
  };

  return resultOfTest;
}

export function randomizeTestAndSaveResult(testType, data) {
  const randomIndex = Math.floor(Math.random() * data.length);

  const resultOfTest = createObjectForSavingResultOfTest(randomIndex, data);
  localStorage.setItem(testType, JSON.stringify(resultOfTest));
}