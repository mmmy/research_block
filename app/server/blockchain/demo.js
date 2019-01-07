const core = require('./core')

const fromBaseSelect1Rules = []
for (let i = 0; i < 1000; i++) {
  fromBaseSelect1Rules.push({
    base: i + 2,
    unique: true,
    count: 1,
  })
}

function hashesToSeriesDemo256(hashes) {
  const fhashParams = ['sha256', 1, 0]
  return core.hashToSeries(hashes, fhashParams, fromBaseSelect1Rules)
}

function hashesToSeriesDemo512(hashes) {
  const fhashParams = ['sha512', 1, 0]
  return core.hashToSeries(hashes, fhashParams, fromBaseSelect1Rules)
}

// console.log(hashesToSeriesDemo512(['1','9']).filter(o => o.result.length > 0).length)

module.exports = {
  hashesToSeriesDemo256,
  hashesToSeriesDemo512
}
