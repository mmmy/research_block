var bigInt = require("big-integer")

const JSONtoCSV = (arr, columns, delimiter = ',') =>
  [
    // columns.join(delimiter),
    ...arr.map(obj =>
      columns.reduce(
        (acc, key) => `${acc}${!acc.length ? '' : delimiter}${typeof obj[key] === 'undefined' ? '' : obj[key]}`,
        ''
      )
    )
  ].join('\n');


const integerToBaseN = (x, baseSymbols) => {
  const m = baseSymbols.length
  const results = []
  let number = bigInt(x, 16)

  while (number.compare(0) > 0) {
    const mod = number.mod(m)                   // number % m
    number = number.subtract(mod)       // number -= mode                    
    number = number.divide(m)           // number /= m
    results.push(baseSymbols[mod])
  }
  return results
}

const permutationFromInteger = (x, baseSymbols, uniq, count) => {
  const results = []
  let bs = baseSymbols.concat()          // copy
  if (typeof bs == 'string') {
    bs = bs.split('')
  }
  let number = bigInt(x, 16)

  while (number.compare(0) > 0) {
    const m = bs.length
    if (m == 0) {
      break
    }
    const mod = number.mod(m)                   // number % m
    const symbol = bs[mod]
    number = number.subtract(mod)       // number -= mode                    
    number = number.divide(m)          // number /= m
    results.push(symbol)
    if (count > 0 && results.length >= count) {
      break
    }
    if (uniq) {
      bs.splice(mod, 1)                   //delete
    }
  }

  return {
    restX: number.toString(16),
    results
  }
}

// console.log(integerToBaseN('8d98fb67850b4fd740330f2e5067595962c61ac86a3358ba5a4de55e66ff5704', '0123456789abcdefghijklmnopqrstuvw'))

// rules = [{symbols[array] or base[int], unique, count}]
const hexIntegerToSeries = (x, rules) => {
  const results = []
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    if (!rule.symbols && !rule.base) {
      throw 'rule.symbols or rule.base must be assign'
    }
    let symbols = rule.symbols
    if (!symbols) {
      symbols = []
      for (let i=0; i<rule.base; i++) {     // 根据base生成 ['1','2','3',...,'base']
        symbols.push(`${i + 1}`)
      }
    }
    const data = permutationFromInteger(x, symbols, rule.unique, rule.count)
    results.push({
      symbols: data.results,
      symbol_index: data.results.map(s => symbols.indexOf(s)),
      rule,
    })
    x = data.restX
  }
  return results
}
/*
// 双色球
let rules = [
  {
    symbols: '0123456789abcdefghijklmnopqrstuvw',
    unique: true,
    count: 6
  }, {
    symbols: '0123456789abcdef',
    unique: true,
    count: 1
  }
]
console.log(hexIntegerToSeries('8d98fb67850b4fd740330f2e5067595962c61ac86a3358ba5a4de55e66ff5704', rules))
// 双色球2
let rules2 = [
  {
    base: 33,
    unique: true,
    count: 6
  }, {
    base: 16,
    unique: true,
    count: 1
  }
]
console.log(hexIntegerToSeries('8d98fb67850b4fd740330f2e5067595962c61ac86a3358ba5a4de55e66ff5704', rules2))
*/

module.exports = {
  JSONtoCSV,
  integerToBaseN,
  permutationFromInteger,
  hexIntegerToSeries,
}
