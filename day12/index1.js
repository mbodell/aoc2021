const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let bfsPath = [];
let paths = [];
let cx = {};

function is_little(node) {
  let lowerNode = node.toLowerCase();
  return node === lowerNode;
}

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
  bfsPath.push(["start"]);
  while(bfsPath.length > 0) {
    let bfsNextPath = [];
    while(bfsPath.length > 0) {
      let path = bfsPath.pop();
      let node = path[path.length-1];
      if(node === "end") {
        paths.push(path);
      } else {
        for(let i=0;i<cx[node].length;i++) {
          let nextNode = cx[node][i];
          if((is_little(nextNode) && path.filter(e=>e===nextNode).length > 1)
            || nextNode === "start") {
            // skip
          } else {
            let nextPath = [...path];
            nextPath.push(nextNode);
            let smallDouble = [];
            for(let j=0;j<nextPath.length;j++) {
              let n = nextPath[j];
              if(is_little(n) && nextPath.filter(e=>e===n).length>1) {
                if(smallDouble.indexOf(n)===-1) {
                  smallDouble.push(n);
                }
              }
            }
            if(smallDouble.length < 2) {
              bfsNextPath.push(nextPath);
            }
          }
        }
      }
    }
    bfsPath = bfsNextPath;
  }
  console.log(paths.length);
});
