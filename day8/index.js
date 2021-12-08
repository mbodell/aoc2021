const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let total = 0;

eachLine(filename, function(line) {
  let output = line.split(" | ")[1];
  let count = output.split(" ").map(e=>e.length);
  total += count.filter(e=>e===2||e===4||e===3||e===7).length;
}).then(function(err) {
  console.log(total);
});
