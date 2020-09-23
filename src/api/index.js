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

const getOne = async ({
  id,
  tableName
}) => {
  const currentData = require(`../mockdata/${tableName}.json`);
  return currentData.find(data => data.id === id);
}

const getAll = async (tableName) => {
  const currentData = require(`../mockdata/${tableName}.json`);
  return currentData;
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
  getOne,
  getAll,
  delete: deleteItem
};

export default sdk;