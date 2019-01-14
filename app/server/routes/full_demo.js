var express = require('express');
var router = express.Router();
const { Bocai } = require('../blockchain/db')

router.post('/ssq', function(req, res, next) {
  const { page, page_size } = req.body
  Promise.all([
    Bocai.getSsqTotal(),
    Bocai.getSsq(page, page_size),
  ]).then(items => {
    const ssqTotal = items[0][0].count
    res.send({
      result: true,
      data: {
        total: ssqTotal,
        list: items[1] || []
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
  const { page, page_size } = req.body
  Promise.all([
    Bocai.getSsqBtcTotal(),
    Bocai.getSsqBtc(page, page_size)
  ]).then(items => {
    const ssqBtcTotal = items[0][0].count
    res.send({
      result: true,
      data: {
        total: ssqBtcTotal,
        list: items[1] || []
      }
    })
  }).catch(e => {
    res.status(500).send({
      result: false,
      info: e
    })
  })
})

module.exports = router
