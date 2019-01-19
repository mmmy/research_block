
const Influx = require('influx')

const blockchain_client = new Influx.InfluxDB({
  database: 'blockchain',
  host: 'localhost',
  port: 8086,
})

const bocai_client = new Influx.InfluxDB({
  database: 'bocai',
  host: 'localhost',
  port: 8086
})

const BtcBlockChain = {
  getBtcBlocksTotal: function() {
    return blockchain_client.query(`select count(hash) from btc_block`)
  },

  getBtcBlocks: function(page, page_size) {
    const offset = (page - 1) * page_size
    return blockchain_client.query(`select * from btc_block order by time desc limit ${page_size} offset ${offset}`)
  },

  getBtcBlockByHeight: function(height) {
    return blockchain_client.query(`select * from btc_block where height = ${height}`)
  },

  getLatestBtcBlocks: function(count = 5) {
    return blockchain_client.query(`select * from btc_block order by time desc limit ${count}`)
  },
}

const Bocai = {
  getSsqTotal: function() {
    return bocai_client.query('select count(date) from ssq')
  },
  getSsqBtcTotal: function() {
    return bocai_client.query('select count(date) from ssq_btc')
  },
  getSsq: function(page, page_size) {
    const offset = (page - 1) * page_size
    return bocai_client.query(`select * from ssq order by time desc limit ${page_size} offset ${offset}`)
  },
  getSsqBtc: function(page, page_size) {
    const offset = (page - 1) * page_size
    return bocai_client.query(`select * from ssq_btc order by time desc limit ${page_size} offset ${offset}`)
  },
}

exports.BtcBlockChain = BtcBlockChain
exports.Bocai = Bocai
