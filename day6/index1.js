const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let fish = [];
let fishDayCnt = [];

eachLine(filename, function(line) {
  fish = line.split(',').map(e=>Number(e.trim()));
}).then(function(err) {
  let days = 0;
  fishDayCnt = fish.reduce((map, val) => {map[val] = (map[val]||0)+1; return map}, {});
  for(days=1;days<=256;days++) {
    let next = [];
    next[8] = (fishDayCnt[0]||0);
    next[7] = (fishDayCnt[8]||0);
    next[6] = (fishDayCnt[7]||0)+(fishDayCnt[0]||0);
    next[5] = (fishDayCnt[6]||0);
    next[4] = (fishDayCnt[5]||0);
    next[3] = (fishDayCnt[4]||0);
    next[2] = (fishDayCnt[3]||0);
    next[1] = (fishDayCnt[2]||0);
    next[0] = (fishDayCnt[1]||0);
    fishDayCnt = next;
  }
  console.log(fishDayCnt.reduce((a,b)=>(a+b)));
});
