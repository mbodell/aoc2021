const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let bfsPath = [];
let paths = [];
let cx = {};
eachLine(filename, function(line) {
  let nodes = line.split("-");
  if( cx[nodes[0]] === undefined ) {
    cx[nodes[0]] = [];
  }
  if( cx[nodes[1]] === undefined ) {
    cx[nodes[1]] = [];
  }
  cx[nodes[0]].push(nodes[1]);
  cx[nodes[1]].push(nodes[0]);
}).then(function(err) {
  console.log(cx);
  console.log(cx["start"]);
});
