const fs = require('fs')
const path = require('path')
const JSONtoCSV = require('../utils').JSONtoCSV

const fileName = 'blocks.csv'
const filePath = path.join(__dirname, fileName)


function remainDays(lastTime) {
  const milSec = new Date() - new Date(lastTime)
  return milSec / (24 * 3600 * 1000)
}

function sleep(sec) {
  return new Promise(resolve => {
    setTimeout(() => {}, sec * 1000)
  })
}

// 写入文件
function saveToFile(list) {
  const d0 = new Date()
  console.log('start save to file')
  const dataToCsv = JSONtoCSV(list, CONFIG.columns)
  fs.appendFileSync(fileName, dataToCsv + '\n')
  const sec = (new Date() - d0) / 1000
  console.log('end save to file, second:', sec)
}

// init request start time
if (fs.existsSync(filePath)) {
  const fileContent = fs.readFileSync(filePath).toString()
  const csvList = fileContent.split('\n')
  const len = csvList.length
  if (len > 0) {
    const last = csvList[len - 2]
    if (last) {
      const timestamp = last.split(',')[0]
      lastTimestamp = timestamp
      console.log('lastTimestamp => ', timestamp)
    }
  }
}
