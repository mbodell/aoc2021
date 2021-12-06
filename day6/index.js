const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let fish = [];

eachLine(filename, function(line) {
  fish = line.split(',').map(e=>Number(e.trim()));
}).then(function(err) {
  let days = 0;
  for(days=1;days<=80;days++) {
    fish = fish.map(e=>--e);
    let newFish = fish.filter(e=>e===-1).length;
    fish = fish.concat(new Array(newFish).fill(8));
    fish = fish.map(e=>(e===-1)?6:e);
  }
  console.log(fish.length);
});
