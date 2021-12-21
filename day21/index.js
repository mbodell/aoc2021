const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let p1s = 0;
let p1p = -1;
let p2s = 0;
let p2p = -1;
let rolls = 0;

let answer = 0;

function rollDie() {
  return (rolls++ % 100) + 1;
}

eachLine(filename, function(line) {
  if(p1p === -1) {
    p1p = Number(line.split(": ")[1]) % 10;
  } else {
    p2p = Number(line.split(": ")[1]) % 10;
  }
}).then(function(err) {
  for(let i=0;p1s<1000&&p2s<1000;i++) {
    let mv = 0;
    for(let j=0;j<3;j++) {
      mv += rollDie();
    }
    if((i%2)===0) {
      // player 1 turn
      p1p += mv;
      p1p = p1p % 10;
      p1s += (p1p===0)?10:p1p;
    } else {
      // player 2 turn
      p2p += mv;
      p2p = p2p % 10;
      p2s += (p2p===0)?10:p2p;
    }
  }
  let loser = Math.min(p1s,p2s);
  answer = loser * rolls;
  console.log(answer);
});
