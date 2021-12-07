const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let crab = [];

eachLine(filename, function(line) {
  crab = line.split(',').map(e=>Number(e.trim()));
}).then(function(err) {
  crab = crab.sort((a,b)=>(a-b));
  let bestTotal = (crab[crab.length-1]*(crab[crab.length-1]+1)/2)*crab.length;
  let bestIndex = -1;
  for(let i=0;i<=crab[crab.length-1];i++) {
    let med = i;
    let newResult = crab.map(e=>(Math.abs(med-e)*(Math.abs(med-e)+1)/2)).reduce((a,b)=>(a+b));
    if(newResult<bestTotal) {
      bestTotal = newResult;
      bestIndex = i;
    } 
  }
  console.log(bestTotal);
});
