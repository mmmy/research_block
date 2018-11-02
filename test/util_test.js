
var assert = require('assert')
var util = require('../util')
// var should = require('should')
const { permutationFromInteger, integerToBaseN } = util
var bigInt = require("big-integer")

const symbols33 = '0123456789abcdefghijklmnopqrstuvw'
const symbols16 = '0123456789abcdef'
const hex64 = '8d98fb67850b4fd740330f2e5067595962c61ac86a3358ba5a4de55e66ff5704'

describe('util test', function() {
  describe('integerToBaseN', function() {
    it('convert to base n should equal', function() {
      const results = integerToBaseN(hex64, symbols16)
      const resultNum = results.reverse().join('')
      assert.equal(hex64, resultNum)
    })
  })

  describe('permutationFromInteger', function() {
    it('not uniq and big count should as same as integerToBaseN', function() {
      const {restX, results} = permutationFromInteger(hex64, symbols33, false)
      assert.equal(bigInt(restX, 16).compare(0), 0)      // restX is 0
      assert.deepEqual(results, integerToBaseN(hex64, symbols33))
    })

    it('uniq result length should as baseSymbole\'s length', function() {
      const {restX, results} = permutationFromInteger(hex64, symbols33, true)
      assert(bigInt(restX, 16).compare(0) > 0)
      assert.equal(results.length, symbols33.length)
    })
  })
})
