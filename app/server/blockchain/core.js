const crypto = require('crypto')
const bigInt = require("big-integer")
const { hexIntegerToSeries } = require('../../../util')
/* 
  处理原始hash => 新hash
  sha: 'sha256', 'sha512'
*/
function createF_hash(sha, a = 1, b = 0) {
  return function(hash) {
    let number = bigInt(hash, 16)
    number = number.multiply(a)
    number = number.add(b)
    number_hex = number.toString(16)
    return crypto.createHash(sha).update(number_hex).digest('hex')
  }
}
// 将多个hash进行连接, 目前只有按先后顺序组成新的hash
function createC_hashes() {
  return function(hashes) {
    return hashes.join('')
  }
}
// 将hash按照F_hashes, C_hashes, rules规则生成一个数组序列
function hashToSeries(hashes, fhashParams, rules) {
  const F_hashes = fhashParams.map(params => createF_hash.apply(null, params))
  const C_hashes = createC_hashes()
  const newHashes = hashes.map(h => F_hashes.map(F_hash => F_hash(h)).join(''))
  const Hfinal = C_hashes(newHashes)
  return hexIntegerToSeries(Hfinal, rules)
}

module.exports = {
  createF_hash,
  createC_hashes,
  hashToSeries,
}
