var express = require('express');
var router = express.Router();
const { Bocai } = require('../blockchain/db')

router.post('/ssq', function(req, res, next) {
  const { page, page_size } = req.body
  Promise.all([
    Bocai.getSsqTotal(),
    Bocai.getSsq(page, page_size),
    Bocai.getSsqBtcTotal(),
    Bocai.getSsqBtc(page, page_size)
  ]).then(items => {
    const ssqTotal = items[0][0].count
    const ssqBtcTotal = items[2][0].count
    res.send({
      result: true,
      ssq: {
        total: ssqTotal,
        list: items[1] || []
      },
      ssq_btc: {
        total: ssqBtcTotal,
        list: items[3] || []
      }
    })
  }).catch(e => {
    res.status(500).send({
      result: false,
      info: e
    })
  })
})

router.post('/ssq_btc', function(req, res, next) {

})

module.exports = router
