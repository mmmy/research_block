var express = require('express');
var router = express.Router();
const { BtcBlockChain } = require('../blockchain/db')
const { hashesToSeriesDemo256, hashesToSeriesDemo512, hashesToSSQ, hashesToDLT, hashesTo5_22, hashesTo20_100 } = require('../blockchain/demo')

/* GET home page. */
router.post('/btc', function(req, res, next) {
  const { page, page_size } = req.body
  Promise.all([BtcBlockChain.getBtcBlocksTotal(), BtcBlockChain.getBtcBlocks(page, page_size)]).then(results => {
    const total = results[0][0].count
    const blocks = results[1]
    res.send({result: true, total, blocks})
  }).catch(e => {
    res.status(500).send({result: false, info: e})
  })
});

router.get('/btc/height', function(req, res, next) {
  const { height } = req.query
  if (height === undefined) {
    res.status(500).send({result: false, info: 'height is required'})
    return
  }
  BtcBlockChain.getBtcBlockByHeight(height).then(items => {
    res.send({result: true, block: items[0]})
  }).catch(e => {
    res.status(500).send({result: false, info: e})
  })
})

router.get('/btc/dice_demo', function(req, res, next) {
  BtcBlockChain.getLatestBtcBlocks(1).then(rows => {
    const block = rows[0]
    const hashes = [block.hash]
    // const dice256 = hashesToSeriesDemo256(hashes)
    // const dice512 = hashesToSeriesDemo512(hashes)
    const ssq = hashesToSSQ(hashes)
    const dlt = hashesToDLT(hashes)
    const from22choose5 = hashesTo5_22(hashes)
    const from100choose20 = hashesTo20_100(hashes)
    res.send({
      result: true,
      block,
      demos: [
        {name: '双色球示例', data: ssq},
        {name: '大乐透示例', data: dlt},
        {name: '22选5示例', data: from22choose5},
        {name: '100选20示例', data: from100choose20},
      ]
    })
  }).catch(e => {
    res.status(500).send({result: false, info: e})    
  })
})

module.exports = router;
