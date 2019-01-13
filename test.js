var d0 = new Date()

var last = 256
var test = 30

for (let i=0; i<2**30; i++) {

}

var sec = (new Date() - d0) / 1000
var secLast = sec * (2 ** (last - test))
var days = secLast / 3600 / 24
var years = days / 360
console.log(sec)
console.log('days', days)
console.log('years', years)

