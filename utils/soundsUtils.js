const path = require('path');
const fs = require('fs');
const soundsPath = (path.resolve(__dirname, '../sounds'));

async function getAvailableSounds() {
  const fileNames = (await readDirForPath(soundsPath))
    .map(removeFileExtensions);
  return fileNames;
}

function removeFileExtensions(fileName) {
  return fileName.split('.')[0];
}

function formatFileNames(previousValue, currentValue, index, array) {
  const fileNameWithPrefix = `\`%${currentValue}\``;

  const isLast = index === array.length - 1;
  if (!isLast) return `${previousValue}${fileNameWithPrefix}\n`
  else return `${previousValue}${fileNameWithPrefix}`;
}

function readDirForPath(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    })
  })
}



module.exports = {
  getAvailableSounds,
  removeFileExtensions,
  formatFileNames,
  readDirForPath,
  soundsPath
}