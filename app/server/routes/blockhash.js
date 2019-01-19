var express = require('express');
var router = express.Router();
const { BtcBlockChain } = require('../blockchain/db')
const { hashToSeries } = require('../blockchain/core')
const { hashesToSeriesDemo256, hashesToSeriesDemo512, hashesToSSQ, hashesToDLT, hashesTo5_22, hashesTo20_100 } = require('../blockchain/demo')

/* GET home page. */
router.post('/btc', function (req, res, next) {
  const { page, page_size } = req.body
  Promise.all([BtcBlockChain.getBtcBlocksTotal(), BtcBlockChain.getBtcBlocks(page, page_size)]).then(results => {
    const total = results[0][0].count
    const blocks = results[1]
    res.send({ result: true, total, blocks })
  }).catch(e => {
    res.status(500).send({ result: false, info: e })
  })
});

router.get('/btc/height', function (req, res, next) {
  const { height } = req.query
  if (height === undefined) {
    res.status(500).send({ result: false, info: 'height is required' })
    return
  }
  BtcBlockChain.getBtcBlockByHeight(height).then(items => {
    res.send({ result: true, block: items[0] })
  }).catch(e => {
    res.status(500).send({ result: false, info: e })
  })
})

router.get('/btc/dice_demo', function (req, res, next) {
  let blocks_count = 3
  BtcBlockChain.getLatestBtcBlocks(blocks_count).then(rows => {

    // const dice256 = hashesToSeriesDemo256(hashes)
    // const dice512 = hashesToSeriesDemo512(hashes)

    const ssqItems = rows.map(r => {
      const hashes = [r.hash]
      return {
        protocol: hashesToSSQ(hashes),
        blocks: [r]
      }
    })
    const dltItems = rows.map(r => {
      const hashes = [r.hash]
      return {
        protocol: hashesToDLT(hashes),
        blocks: [r]
      } 
    })
    const from22choose5Items = rows.map(r => {
      const hashes = [r.hash]
      return {
        protocol: hashesTo5_22(hashes),
        blocks: [r]
      } 
    })
    const from100choose20Items = rows.map(r => {
      const hashes = [r.hash]
      return {
        protocol: hashesTo20_100(hashes),
        blocks: [r]
      } 
    })

    res.send({
      result: true,
      blocks: rows,
      demos: [
        { name: '双色球', id: 'ssq_btc', items: ssqItems },
        { name: '大乐透', id: 'dlt_btc', items: dltItems },
        { name: '22选5', id: '_5_22_btc', items: from22choose5Items },
        { name: '100选20', id: '_20_100_btc', items: from100choose20Items },
      ]
    })
  }).catch(e => {
    res.status(500).send({ result: false, info: e })
  })
})

router.post('/demo/playground', (req, res, next) => {
  const { hashes, rules, fhashes } = req.body
  try {
    const data = hashToSeries(hashes, fhashes, rules)
    res.cookie('client', 'browser')
    res.send({
      result: true,
      data
    })
  } catch(e) {
    res.status(500).send({
      result: false,
      info: e
    })
  }
})

module.exports = router
