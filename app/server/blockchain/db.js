
const Influx = require('influx')

const blockchain_client = new Influx.InfluxDB({
  database: 'blockchain',
  host: 'localhost',
  port: 8086,
})

const BtcBlockChain = {
  getBtcBlocksTotal: function() {
    return blockchain_client.query(`select count(hash) from btc_block`)
  },

  getBtcBlocks: function(page, page_size) {
    const offset = page * page_size
    return blockchain_client.query(`select * from btc_block order by time limit ${page_size} offset ${offset}`)
  },

  getBtcBlockByHeight: function(height) {
    return blockchain_client.query(`select * from btc_block where height = ${height}`)
  },
}

exports.BtcBlockChain = BtcBlockChain
