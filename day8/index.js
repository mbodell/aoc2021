const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let crab = [];

eachLine(filename, function(line) {
  crab = line.split(',').map(e=>Number(e.trim()));
}).then(function(err) {
  crab = crab.sort((a,b)=>(a-b));
  let median = crab[Math.ceil(crab.length/2)-1];
  let total = crab.map(e=>Math.abs(median-e)).reduce((a,b)=>(a+b));
  console.log(total);
});
