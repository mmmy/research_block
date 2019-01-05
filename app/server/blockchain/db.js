
const Influx = require('influx')

const blockchain_client = new Influx.InfluxDB({
  database: 'blockchain',
  host: 'localhost',
  port: 8086,
})

const BlockChain = {
  getBtcBlocksTotal: function() {
    return blockchain_client.query(`select count(*) from btc_blocks`)
  }
  
}

exports.BlockChain = BlockChain
