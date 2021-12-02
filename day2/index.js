const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let depth = 0;
let forward = 0;

eachLine(filename, function(line) {
  var input = line.match(/(\w+) (\d+)/);
  switch(input[1]) {
    case 'up': depth -= Number(input[2]); break;
    case 'down': depth += Number(input[2]); break;
    case 'forward': forward += Number(input[2]); break;
  }
}).then(function(err) {
  console.log(depth*forward);
});
