const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let bits = [];
let size = -1;
eachLine(filename, function(line) {
  var input = line.slice();
  if(size == -1) {
    size = line.length;
    for(let i=0;i<size;i++) {
      bits[i] = [];
      bits[i]["0"] = 0;
      bits[i]["1"] = 0;
    }
  }
  for(let i=0;i<size;i++) {
    bits[i][input[i]]++;
  }
}).then(function(err) {
  let gamma = "";
  let epsilon = "";
  for(let i=0;i<size;i++) {
    if(bits[i]["0"] > bits[i]["1"]) {
      gamma += "0";
      epsilon += "1";
    } else {
      gamma += "1";
      epsilon += "0";
    }
  }
  console.log(parseInt(gamma,2)*parseInt(epsilon,2));
});
