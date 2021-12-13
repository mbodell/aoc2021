const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let grid = [];
let points = [];
let folds = [];

eachLine(filename, function(line) {
  if(line.indexOf(",")>=0) {
    points.push(line.split(",").map(e=>Number(e)));
  } else if (line.indexOf("=")>=0) {
    let inst = line.split("=");
    let f = [];
    f[0] = inst[0].charAt(inst[0].length-1);
    f[1] = inst[1];
    folds.push(f);
  }
}).then(function(err) {
  console.log(points);
  console.log(folds);
});
