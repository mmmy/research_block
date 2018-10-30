const fs = require('fs')
const path = require('path')
const JSONtoCSV = require('../util').JSONtoCSV
var blockexplorer = require('blockchain.info/blockexplorer')
const _ = require('lodash')

const fileName = 'blocks.csv'
const filePath = path.join(__dirname, fileName)
const columns = ['height', 'time', 'hash', 'main_chain']

let CACHE = []
function findInCache(height) {
  for (var i=0; i<CACHE.length; i++) {
    const c = CACHE[i]
    if (c.height == height) {
      return c
    }
  }
}

function clearCache() {
  CACHE = []
}

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
      lastHeight = +splits[0]
      lastTimestamp = timestamp * 1000 + 24 * 3600 * 1000// 往后24小时
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
    let requestTime = lastTimestamp
    try {
      const res = await blockexplorer.getBlocks(requestTime)
      let list = res.blocks
      list = list.filter(b => b.height > lastHeight)
      list = _.uniqBy(list, 'height')
      const len = list.length
      if (len === 0) {
        console.log('data len is 0, go next day')
      } else {
        const newHeights = list.map(b => b.height)
        const newLastHeight = list[list.length - 1].height
        const missedHeights = []
        // check miss data
        for (let i=lastHeight + 1; i < newLastHeight; i++) {
          if(newHeights.indexOf(i) < 0) {
            missedHeights.push(i)
          }
        }

        if (missedHeights.length > 0) {
          console.log('missed data =>', missedHeights)
          for (let j=0; j<missedHeights.length; j++) {
            const h = missedHeights[j]
            const blockFromCache = findInCache(h)
            let blocks = []
            if (blockFromCache) {
              console.log('b from cache')
              blocks = [blockFromCache]
            } else {
              const resH = await blockexplorer.getBlockHeight(h)
              blocks = resH.blocks
              if (!(blocks && blocks[0] && blocks[0].height)) {
                console.log('get block wrong')
                process.exit(1)
              }
              CACHE.push(blocks[0])
            }
            list = list.concat(blocks)
            sleep(1)
          }
        }

        list.sort((a, b) => a.height - b.height)
        if (list[0].height - lastHeight !== 1) {
          console.log('first wrong')
          process.exit(1)
        }
        if (list.length !== newLastHeight - lastHeight) {
          console.log('length wrong')
          process.exit(1)
        }
        saveToFile(list)
        lastHeight = newLastHeight
        clearCache()
      }
      
      lastTimestamp = lastTimestamp + 24 * 3600 * 1000// 往后24小时
      sleep(1)
    } catch (e) {
      console.log(e)
    }
  }
}

run()
