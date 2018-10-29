const fs = require('fs')
const path = require('path')
const JSONtoCSV = require('../util').JSONtoCSV
var blockexplorer = require('blockchain.info/blockexplorer')

const fileName = 'blocks.csv'
const filePath = path.join(__dirname, fileName)
const columns = ['height', 'time', 'hash', 'main_chain']

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
  const dataToCsv = JSONtoCSV(list, columns)
  fs.appendFileSync(fileName, dataToCsv + '\n')
  const sec = (new Date() - d0) / 1000
  console.log('end save to file, second:', sec)
}

let lastTimestamp = 1231006505000
let lastHeight = -1

// init request start time
if (fs.existsSync(filePath)) {
  const fileContent = fs.readFileSync(filePath).toString()
  const csvList = fileContent.split('\n')
  const len = csvList.length
  if (len > 0) {
    const last = csvList[len - 2]
    if (last) {
      const splits = last.split(',')
      const timestamp = splits[1]
      lastHeight = splits[0]
      lastTimestamp = timestamp * 1000
      console.log('height => ', lastHeight, 'lastTimestamp => ', lastTimestamp)
    }
  }
}

async function run() {
  let hasNewData = new Date(lastTimestamp) < new Date()
  if (!hasNewData) {
    console.log('has no new data, exit')
  }
  while(hasNewData) {
    const remains = Math.round(remainDays(lastTimestamp))
    console.log('remain days:', remains)
    if (remains === 0) {
      console.log('remain is 0, finished')
      break
    }
    lastTimestamp = lastTimestamp + 24 * 3600 * 1000// 往后24小时
    let requestTime = lastTimestamp
    try {
      const res = await blockexplorer.getBlocks(requestTime)
      const list = res.blocks
      const len = list.length
      if (len === 0) {
        console.log('data len is 0')
      } else {
        newBlockHeight = list[0].height
        if (newBlockHeight - lastHeight !== 1) {
          console.log('height wrong')
          process.exit(1)
        }
        lastHeight = list[list.length - 1].height
        saveToFile(list)
      }

      sleep(1)
    } catch (e) {
      console.log(e)
    }
  }
}

run()
