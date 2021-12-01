const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let total = 0;
let last = 0;
let n1 = 0;
let n2 = 0;
let n3 = 0;

eachLine(filename, function(line) {
  let newTot = last + Number(line) - n1;
  if(n1 > 0 && (last < newTot)) {
    total++;
  }
  last = newTot;
  n1 = n2;
  n2 = n3;
  n3 = Number(line);
}).then(function(err) {
  console.log(total);
});
