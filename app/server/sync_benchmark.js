/**
 * 同步生成 bocai 数据
 */

const { hashesToSSQ } = require('./blockchain/demo')

const Influx = require('influx')

const bocai_client = new Influx.InfluxDB({
  host: 'localhost',
  port: 8086,
  database: 'bocai'
})

const blockchain_client = new Influx.InfluxDB({
  host: 'localhost',
  port: 8086,
  database: 'blockchain'
})

function getLastSsqMock() {
  return bocai_client.query('select * from ssq_btc order by time desc limit 1')
}

function getFirstSsq() {
  return bocai_client.query('select * from ssq order by time limit 1')
}

function getLastSsq() {
  return bocai_client.query('select * from ssq order by time desc limit 1')
}

function getBtcBlocks(from_date) {
  return blockchain_client.query(`select * from btc_block where time > '${from_date}' order by time`)
}

function getBtcBlocksByTime(from_date, count = 1) {
  return blockchain_client.query(`select * from btc_block where time > '${from_date}' and time < '${from_date}' + 1d order by time limit ${count}`)
}

async function main() {
  const firstSsq = (await getFirstSsq())[0]
  const lastSsqMock = (await getLastSsqMock())[0]

  if (!firstSsq) {
    console.log('ssq no data')
    return
  }
  // const firstSsqDate = firstSsq.date
  const lastSsqMockDate = lastSsqMock && lastSsqMock.date
  const whereClause = lastSsqMockDate ? `where time > '${lastSsqMockDate}'` : "where time > '2009-01-09'"
  const dates_rows = await bocai_client.query(`select * from ssq ${whereClause} order by time`)
  console.log('需要同步日期数', dates_rows && dates_rows.length)

  const ssqMockPoints = []
  if (dates_rows && dates_rows.length > 0) {
    // const start_date = dates_rows[0].date
    // const btcBlocks = await getBtcBlocks(start_date)
    Promise.all(dates_rows.map(async (row, i) => {
      const { date, id, time } = row
      // ssq 是北京时间晚上21：15开奖，utc为13:15, 找到之后的第一个出块
      return new Promise((resolve, reject) => {
        getBtcBlocksByTime(`${date}T13:15:00Z`, 1).then(blocks => {
          if (blocks.length > 0) {
            const hashes = blocks.map(b => b.hash)
            const { result } = hashesToSSQ(hashes)
            const reds = result[0].symbols
            const blues = result[1].symbols
            resolve({
              measurement: 'ssq_btc',
              fields: {
                date,
                id,
                r1: reds[0],
                r2: reds[1],
                r3: reds[2],
                r4: reds[3],
                r5: reds[4],
                r6: reds[5],
                b1: blues[0],
              },
              timestamp: time * 1E6
            })
          } else {
            resolve()
          }
        })
      })
    })).then(points => {
      const ssqMockPoints = points.filter(item => item)
      // 写入数据库
      console.log('写入ssq_btc', ssqMockPoints.length)
      bocai_client.writePoints(ssqMockPoints)
    })
  }
}

main()
