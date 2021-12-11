const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let cave = [];
let flashes = 0;
let steps = process.argv.slice(3)[0] || 100;

eachLine(filename, function(line) {
  cave.push([...line].map(e=>Number(e)));
}).then(function(err) {
  for(let i=0;i<steps;i++) {
    // First, the energy level of each octopus increases by 1.
    cave = cave.map(e=>e.map(f=>f+1));
    let fl = 1;
    while(fl!==0) {
      fl = cave.map(e=>e.filter(f=>f>9&&f<100).length).reduce((a,b)=>a+b);
      cave = cave.map(e=>e.map(f=>(f>9&&f<100)?f+100:f));
      for(let j=0;j<cave.length;j++) {
        for(let k=0;k<cave[j].length;k++) {
          if(cave[j][k]>=100&&cave[j][k]<200) {
            if(k>0) {
              if(j>0) {
                cave[j-1][k-1]++;
              }
              cave[j][k-1]++;
              if(j+1<cave.length) {
                cave[j+1][k-1]++;
              }
            }
            if(k+1<cave[j].length) {
              if(j>0) {
                cave[j-1][k+1]++;
              }
              cave[j][k+1]++;
              if(j+1<cave.length) {
                cave[j+1][k+1]++;
              }
            }
            if(j>0) {
              cave[j-1][k]++;
            }
            if(j+1<cave[j].length) {
              cave[j+1][k]++;
            }
            cave[j][k] += 100;
          }
        }
      }
    }
    flashes += cave.map(e=>e.filter(f=>f>100).length).reduce((a,b)=>a+b);
    cave = cave.map(e=>e.map(f=>(f>100)?0:f));
  }
  console.log(flashes);
});
