const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let ddice = [0n,0n,0n,1n,3n,6n,7n,6n,3n,1n];
let p1 = [];
let p2 = [];
let p1p = -1;
let p2p = -1;
let answer = 0n;

function capture(s, p) {
  let wins = 0n;
  let active = 0n;
  for(let i=0;i<21;i++) {
    s[i].map(e=>active+=e);
  }
  for(let i=21;i<31;i++) {
    s[i].map(e=>wins+=e);
    s[i].fill(0n);
  }
//  console.log(p);
//  console.log(s);
  return [wins,active];
}

function advance(s) {
  let temp = new Array(31).fill(0n).map(e=>new Array(10).fill(0n));
  for(let i=0;i<31;i++) {
    for(let j=0;j<10;j++) {
      temp[i][j] = s[i][j];
      s[i][j] = 0n;
    }
  }
  for(let i=0;i<21;i++) {
    let pos = new Array(10).fill(0n);
    for(let j=0;j<10;j++) {
      for(let d=3;d<10;d++) {
        pos[(d+j)%10] += ddice[d] * temp[i][j];
      }
    }
    for(let j=0;j<10;j++) {
      s[i+j+1][j] += pos[j];
    }
  }
//  console.log(s);
}

eachLine(filename, function(line) {
  if(p1p === -1) {
    p1p = Number(line.split(": ")[1]);
  } else {
    p2p = Number(line.split(": ")[1]);
  }
}).then(function(err) {
  // solve how many universe win, in play at each turn for each player
  
  // Solve p1
  let score = new Array(31).fill(0n).map(e=>new Array(10).fill(0n));
  score[0][p1p-1] = 1n;
  p1.push(capture(score, p1));
  for(let t=0;t<11;t++) {
    advance(score);
    p1.push(capture(score, p1));
  }
  console.log(p1);
  // Solve p2
  let score2 = new Array(31).fill(0n).map(e=>new Array(10).fill(0n));
  score2[0][p2p-1] = 1n;
  p2.push(capture(score2, p2));
  for(let t=0;t<11;t++) {
    advance(score2);
    p2.push(capture(score2, p2));
  }
  console.log(p2);
  let p1w = 0n;
  for(let i=1;i<p1.length;i++) {
    p1w += p1[i][0] * p2[i-1][1];
  }
  let p2w = 0n;
  for(let i=0;i<p2.length;i++) {
    p2w += p2[i][0] * p1[i][1];
  }
  console.log(p1w);
  console.log(p2w);
  answer = (p1w>p2w)?p1w:p2w;
  console.log(answer);
});
