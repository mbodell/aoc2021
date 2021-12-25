const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let floor = [];
let w = 0;
let h = 0;

let answer = 0;

eachLine(filename, function(line) {
  floor.push(line.split(""));
}).then(function(err) {
  w = floor[0].length;
  h = floor.length;
  let done = false;
  let step = 0;
  for(step=0;!done;step++) {
    done = true;
    // East
    let moves = new Set();
    for(let y=0;y<h;y++) {
      for(let x=0;x<w;x++) {
        if(floor[y][x]==='>') {
          if(floor[y][(x+1)%w]==='.') {
            moves.add([y,x]);
          }
        }
      }
    }
    if(moves.size>0) {
      done = false;
    }
    moves.forEach(function(v) {
      floor[v[0]][(v[1]+1)%w] = '>';
      floor[v[0]][v[1]] = '.';
    });
    moves = new Set();
    for(let y=0;y<h;y++) {
      for(let x=0;x<w;x++) {
        if(floor[y][x]==='v') {
          if(floor[(y+1)%h][x]==='.') {
            moves.add([y,x]);
          }
        }
      }
    }
    if(moves.size>0) {
      done = false;
    }
    moves.forEach(function(v) {
      floor[(v[0]+1)%h][v[1]] = 'v';
      floor[v[0]][v[1]] = '.';
    });
  }
  answer = step;
  console.log(floor);
  console.log(answer);
});
