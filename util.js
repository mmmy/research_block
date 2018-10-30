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
  while (x > 0) {
    const mod = x % m
    x -= mod
    x /= m
    results.push(baseSymbols[mod])
  }
  return results.reverse().join('')
}

console.log(integerToBaseN(0x100, '0123456789abcdefghijklmnopqrstuvw'))

module.exports = {
  JSONtoCSV,
  integerToBaseN
}
