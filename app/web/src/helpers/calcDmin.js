
function calcRule(rule) {
  const { base, count, unique } = rule
  if (unique) {
    // M!/(M-N)! = M*(M-1)*(M-2)...(M-N+1)
    let total = base
    for (let i = 1; i < count; i++) {
      total = total * (base - i)
    }
    return Math.log(total) / Math.log(16)
  } else {
    return Math.log(base ** count) / Math.log(16)
  }
}

function calcDmin(rules) {
  let dmin = 0
  rules.forEach(r => {
    dmin = dmin + calcRule(r)
  })
  return dmin
}

exports.calcDmin = calcDmin

// var dmin = calcDmin([{ unique: true, base: 33, count: 6 }, { unique: true, base: 16, count: 1 }])
// console.log(dmin)
