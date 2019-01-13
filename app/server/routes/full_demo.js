var express = require('express');
var router = express.Router();

router.post('/ssq', function(req, res, next) {
  res.send({
    result: true,
    data: 'ssq'
  })
})

router.post('/ssq_btc', function(req, res, next) {

})

module.exports = router
