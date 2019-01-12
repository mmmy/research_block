var influx = require('influx')

var client = new influx.InfluxDB({
  host: 'localhost',
  port: 8086,
  database: 'blockchain'
})

var d0 = new Date()

client.query('select * from btc_block').then(rows => {
  console.log(rows.length)
  console.log('times', (new Date() - d0) / 1000)
})
