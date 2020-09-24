import fs from 'fs';

const insert = async ({
  updateData,
  tableName
}) => {
  const currentData = require(`../mockdata/${tableName}.json`);
  const {
    id
  } = updateData;
  let haveUpdated = false;
  for (let i = 0; i < currentData.length; i++) {
    if (currentData[i].id === id) {
      currentData[i] = {
        ...currentData[i],
        ...updateData,
      };
      haveUpdated = true;
    }
  }

  if (!haveUpdated) {
    currentData.push(updateData);
  }

  await fs.writeFile(`../mockdata/${tableName}.json`, currentData, 'utf-8');
  return updateData;
}

const getOneInterviewee = async ({
  id,
  fullname
}) => {
  const currentData = require(`../mockdata/interviewee.json`);
  return currentData.find(data => data.id === id && data.fullname === fullname);
}

const getAll = async (tableName) => {
  const currentData = require(`../mockdata/${tableName}.json`);
  return currentData;
}

const saveTestReviewAndScore = async ({ id, testType, newData }) => {
  const currentResult = require(`../mockdata/result.json`);

  const newResult = currentResult.map(item => {
    if (item.id === id) return {
      ...item,
      [testType]: newData
    }; else return item;
  })

  // await fs.writeFile(`../mockdata/result.json`, newResult, 'utf-8');
  return newResult;
}

const deleteItem = async ({
  id,
  tableName
}) => {
  const currentData = require(`../mockdata/${tableName}.json`);
  const updateData = currentData.filter(data => data.id !== id);
  await fs.writeFile(`../mockdata/${tableName}.json`, updateData, 'utf-8');
  return updateData;
}

const sdk = {
  insert,
  getOneInterviewee,
  getAll,
  saveTestReviewAndScore,
  delete: deleteItem
};

export default sdk;