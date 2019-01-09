var express = require('express');
var router = express.Router();
const { BtcBlockChain } = require('../blockchain/db')
const { hashesToSeriesDemo256, hashesToSeriesDemo512 } = require('../blockchain/demo')

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
    const dice256 = hashesToSeriesDemo256(hashes)
    const dice512 = hashesToSeriesDemo512(hashes)
    res.send({
      result: true,
      block,
      dice256,
      dice512,
    })
  }).catch(e => {
    res.status(500).send({result: false, info: e})    
  })
})

module.exports = router;
