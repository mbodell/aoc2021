const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let p1s = [];
let p1p = -1;
let p2s = [];
let p2p = -1;
let rolls = 0;
let p1 = [];
let p2 = [];

let p1w = 0n;
let p2w = 0n;
let p1wa = 0n;
let p2wa = 0n;
let pu = 0n;
let nu = 1n;

let answer = 0n;

function rollDie() {
  return (rolls++ % 100) + 1;
}

let ddice = [0n,0n,0n,1n,3n,6n,7n,6n,3n,1n];

eachLine(filename, function(line) {
  if(p1p === -1) {
    p1p = Number(line.split(": ")[1]) % 10;
  } else {
    p2p = Number(line.split(": ")[1]) % 10;
  }
}).then(function(err) {
  // load universes
  for(let i=0;i<31;i++) {
    p1s[i] = 0n;
    p2s[i] = 0n;
  }
  p1s[0] = 1n;
  p2s[0] = 1n;
  pu = 1n;
  for(let i=0;i<10;i++) {
    p1[i] = 0n;
    p2[i] = 0n;
  }
  p1[p1p] = 1n;
  p2[p2p] = 1n;

  let i = 0;

  for(;pu > 0&&i<10;i++) {
    console.log(`There are ${nu} universes and p1 has won ${p1w} and p2 has won ${p2w}, or ${p1wa} and ${p2wa}`);
    console.log(p1);
    console.log(p2);
    console.log(p1s);
    console.log(p2s);
    let p1sum = 0n;
    let p2sum = 0n;
    let p1ssum = 0n;
    let p2ssum = 0n;
    for(let k=0;k<p1.length;k++) {
      p1sum += p1[k];
    }
    for(let k=0;k<p2.length;k++) {
      p2sum += p2[k];
    }
    for(let k=0;k<p1s.length;k++) {
      p1ssum += p1s[k];
    }
    for(let k=0;k<p2.length;k++) {
      p2ssum += p2s[k];
    }
    console.log(`On turn ${i} there are ${p1sum} and ${p2sum} with ${p1ssum} and ${p2ssum}`);
    nu *= 27n;
    if((i%2)===0) {
      // player 1 turn
      let tp1 = new Array(10).fill(0n);
      // update positions
      for(let j=3;j<ddice.length;j++) {
        for(let k=0;k<p1.length;k++) {
          tp1[(k+j)%10] += ddice[j] * p1[k];
        }
      }
      // update scores
      let tp1s = new Array(31).fill(0n);
      for(let k=0;k<tp1.length;k++) {
        let s = (k===0)?10:k;
        for(let j=s;j<31;j++) {
          tp1s[j] += p1s[j-s] * tp1[k];
        }
      }
      // count p1 winners
      let win = 0n;
      for(let k=21;k<tp1s.length;k++) {
        win += tp1s[k];
        tp1s[k] = 0n;
      }
      let p2u = 0n;
      for(let k=0;k<21;k++) {
        p2u += p2s[k];
      }
      p1w += win*p2u;
      p1wa += win;
      p1 = tp1;
      p1s = tp1s;
    } else {
      // player 2 turn
      let tp2 = new Array(10).fill(0n);
      // update positions
      for(let j=3;j<ddice.length;j++) {
        for(let k=0;k<p2.length;k++) {
          tp2[(k+j)%10] += ddice[j] * p2[k];
        }
      }
      // update scores
      let tp2s = new Array(31).fill(0n);
      for(let k=0;k<tp2.length;k++) {
        let s = (k===0)?10:k;
        for(let j=s;j<31;j++) {
          tp2s[j] += p2s[j-s] * tp2[k];
        }
      }
      // count p2 winners
      let win = 0n;
      for(let k=21;k<tp2s.length;k++) {
        win += tp2s[k];
        tp2s[k] = 0n;
      }
      let p1u = 0n;
      for(let k=0;k<21;k++) {
        p1u += p1s[k];
      }
      p2w += win*p1u;
      p2wa += win;
      p2 = tp2;
      p2s = tp2s;
    }
    let tp1u = 0n;
    let tp2u = 0n;
    for(k=0;k<21;k++) {
      tp1u += p1s[k];
      tp2u += p2s[k];
    }
    pu = tp1u * tp2u;
  }
  console.log(`pu is ${pu}`);
  console.log(`nu is ${nu}`);
  console.log(`p1w is ${p1w}`);
  console.log(`p2w is ${p2w}`);
  console.log(`i is ${i}`);
  console.log(`p1wa is ${p1wa}`);
  console.log(`p2wa is ${p2wa}`);
  answer = (p1w>p2w)?p1w:p2w;
  console.log(answer);
});
