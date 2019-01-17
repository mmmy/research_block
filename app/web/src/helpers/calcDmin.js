var Decimal = require('decimal.js').Decimal

const log16 = Math.log(16)
function calcRule(rule) {
  const { base, count, unique } = rule
  if (unique) {
    // M!/(M-N)! = M*(M-1)*(M-2)...(M-N+1)
    let total = new Decimal(base)
    for (let i = 1; i < count; i++) {
      total = total.mul(base - i)
    }
    return total.ln().div(log16)
  } else {
    return Decimal.pow(base, count).ln().div(log16)
  }
}

function calcDmin(rules) {
  let total = new Decimal(0)
  total.precision = 2
  rules.forEach(r => {
    total = total.add(calcRule(r))
  })
  return total.toNumber()
}

exports.calcDmin = calcDmin

// var dmin = calcDmin([{ unique: true, base: 33, count: 6 }])
// console.log(dmin)
