const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let inputs = [];
let size = -1;
eachLine(filename, function(line) {
  inputs.push(line);
  if(size < 0) { size = line.length; }
}).then(function(err) {
  let oxygenGen = inputs;
  for(let i=0;i<size&&oxygenGen.length > 1; i++) {
    let pattern = "^" + ".".repeat(i);
    let ones = oxygenGen.filter(number => RegExp(pattern + "1").test(number));
    let zeros = oxygenGen.filter(number => RegExp(pattern + "0").test(number));
    if(ones.length < zeros.length) {
      oxygenGen = zeros;
    } else {
      oxygenGen = ones;
    }
  }
  let co2scrub = inputs;
  for(let i=0;i<size&&co2scrub.length > 1; i++) {
    let pattern = "^";
    for(let j=0;j<i;j++) { pattern += "."; }
    let ones = co2scrub.filter(number => RegExp(pattern + "1").test(number));
    let zeros = co2scrub.filter(number => RegExp(pattern + "0").test(number));
    if(ones.length >= zeros.length) {
      co2scrub = zeros;
    } else {
      co2scrub = ones;
    }
  }
  console.log(parseInt(oxygenGen,2)*parseInt(co2scrub,2));
});
