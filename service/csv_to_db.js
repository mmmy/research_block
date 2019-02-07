const Influx = require('influx')
const path = require('path')
const fs = require('fs')

const db_client = new Influx.InfluxDB({
  database: 'blockchain',
  host: 'localhost',
  port: 8086,
})

const filePath = path.join(__dirname, '../data/blocks.csv')

const fileContent = fs.readFileSync(filePath).toString()
const csvList = fileContent.split('\n')
const len = csvList.length

const sleep = (secs) => {
  return new Promise((resolve) => {
    setTimeout(resolve, secs * 1000)
  })
}

let dataPoints = []
// let maxHeight = 556971
let maxHeight = 561789

for (let i = 0; i < csvList.length - 1; i++) {
  const row = csvList[i]
  const splits = row.split(',')
  const height = +splits[0]
  const time = +splits[1]
  const hash = splits[2]
  if (height <= maxHeight) {
    dataPoints.push({
      measurement: 'btc_block',
      fields: { time, hash, height },
      timestamp: new Date(time * 1000) * 1E6
    })
  }
}

const writelen = 1E4
const startPage = 18
dataPoints = dataPoints.slice(writelen * startPage)

function delayWrite() {
  const remainTimes = dataPoints.length / writelen
  const dataToWrite = dataPoints.slice(0, writelen)
  dataPoints = dataPoints.slice(writelen)
  if (dataToWrite.length > 0) {
    console.log('write data and remians', remainTimes)
    db_client.writePoints(dataToWrite).then(() => {
      console.log('write success')
      setTimeout(() => {
        delayWrite()
      }, 1 * 1000)
    }).catch(e => {
      console.log('write error', e)
    })
  } else {
    console.log('write finish')
  }
}

delayWrite()