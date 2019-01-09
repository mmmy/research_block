
// https://www.blockchain.com/zh/api/api_websocket

const Influx = require('influx')

const WebSocketClient = require('./ReconnectingSocket')

const argv = require('./argv')

const options = {
  ...argv
}

const db_client = new Influx.InfluxDB({
  database: 'blockchain',
  host: 'localhost',
  port: 8086,
})

const uri = 'wss://ws.blockchain.info/inv'

const wsClient = new WebSocketClient(options)
const subs = [
  {"op":"blocks_sub"}
]

wsClient.onopen = function() {
  console.log('client Connection opened.')
  subs.forEach(sub => {
    wsClient.send(JSON.stringify(sub))
  })
  _interval = setInterval(() => {
    wsClient.send(JSON.stringify({"op":"ping"}))
  }, 10 * 1000)
}

wsClient.onclose = function (code) {
  console.log('client Connection closed.')
}

wsClient.onmessage = function (jsonStr) {
  try {
    const json = JSON.parse(jsonStr)
    if (json.op === 'block') {
      handRecieveBlock(json)
    }
    // const json = pako.inflateRaw(buffer, { to: 'string' })
    // console.log(json)
  } catch (err) {
    console.log('client parse data error', err)
  }
}
wsClient.onerror = function (err) {
  console.log('client onerror', err)
}
wsClient.onend = function () {
  console.log('client Connection onend.')
  clearInterval(_interval)
}
wsClient.open(uri)

function handRecieveBlock(json) {
  try {
    const { x } = json
    const { time, hash, height, nTx, totalBTCSent, mrklRoot } = x
    db_client.writePoints([{
      measurement: 'btc_block',
      fields: { time, hash, height, nTx, totalBTCSent, mrklRoot },
      timestamp: new Date(time * 1000) * 1E6
    }])
  } catch (e) {
    console.log('write data error', e)
  }
}