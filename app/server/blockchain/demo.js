const core = require('./core')

const fromBaseSelect1Rules = []
for (let i = 0; i < 1000; i++) {
  fromBaseSelect1Rules.push({
    base: i + 2,
    unique: true,
    count: 1,
  })
}

// 彩票demo
// 1.双色球
const ssqRules = [
  {
    base: 33,
    unique: true,
    count: 6,
  },
  {
    base: 16,
    unique: true,
    count: 1
  }
]
// 2.大乐透
const dltRules = [
  {
    base: 35,
    count: 5,
    unique: true,
  },
  {
    base: 12,
    count: 2,
    unique: true
  }
]

// 3. 22选5
const rules5_22 = [
  {
    base: 22,
    count: 5,
    unique: true,
  }
]

// 4. 100 选 20
const rules20_100 = [
  {
    base: 100,
    count: 20,
    unique: true,
  }
]

function hashesToSeriesDemo256(hashes) {
  const fhashParams = [['sha256', 1, 0]]
  const result = core.hashToSeries(hashes, fhashParams, fromBaseSelect1Rules).filter(o => o.result.length > 0)
  return {
    result,
    fhashParams,
  }
}

function hashesToSeriesDemo512(hashes) {
  const fhashParams = [['sha512', 1, 0]]
  const result = core.hashToSeries(hashes, fhashParams, fromBaseSelect1Rules).filter(o => o.result.length > 0)
  return {
    result,
    fhashParams,
  }
}

function hashesToSSQ(hashes) {
  const fhashParams = [['sha256', 1, 0]]
  const result = core.hashToSeries(hashes, fhashParams, ssqRules)
  return {
    result,
    fhashParams,
  }
}

function hashesToDLT(hashes) {
  const fhashParams = [['sha256', 1, 1]]
  const result = core.hashToSeries(hashes, fhashParams, dltRules)
  return {
    result,
    fhashParams,
  }
}

function hashesTo5_22(hashes) {
  const fhashParams = [['sha256', 1, 2]]
  const result = core.hashToSeries(hashes, fhashParams, rules5_22)
  return {
    result,
    fhashParams,
  }
}

function hashesTo20_100(hashes) {
  const fhashParams = [['sha512', 1, 0]]
  const result = core.hashToSeries(hashes, fhashParams, rules20_100)
  return {
    result,
    fhashParams,
  }
}

// console.log(hashesToSeriesDemo512(['1','9']).filter(o => o.result.length > 0).length)

module.exports = {
  hashesToSeriesDemo256,
  hashesToSeriesDemo512,
  hashesToSSQ,
  hashesToDLT,
  hashesTo5_22,
  hashesTo20_100,
}
