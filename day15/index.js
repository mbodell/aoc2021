const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let cave = [];

let costs = [];

let cheapest = [];

eachLine(filename, function(line) {
  cave.push(line.split("").map(e=>Number(e)));
}).then(function(err) {
  let end = cave.length-1;
  cheapest = new Array(end+1).fill(0).map(() => new Array(end+1));
  costs = new Array(end*end*9).fill(0).map(() => new Array());
  costs[0].push([0,0]);
  while(cheapest[end][end]===undefined) {
    let cand = [];
    for(let i=0;i<costs.length&&cand.length === 0;i++) {
      if(costs[i].length > 0) {
        cand = costs[i].pop();
        if(cheapest[cand[0]][cand[1]]===undefined) {
          cheapest[cand[0]][cand[1]] = i;
          // up
          if(cand[0]>0) {
            costs[i+cave[cand[0]-1][cand[1]]].push([cand[0]-1,cand[1]]);
          }
          // down
          if(cand[0]<end) {
            costs[i+cave[cand[0]+1][cand[1]]].push([cand[0]+1,cand[1]]);
          }
          // left
          if(cand[1]>0) {
            costs[i+cave[cand[0]][cand[1]-1]].push([cand[0],cand[1]-1]);
          }
          // right
          if(cand[1]<end) {
            costs[i+cave[cand[0]][cand[1]+1]].push([cand[0],cand[1]+1]);
          }
        }
      }
    }
  }
  // console.log(cheapest);
  console.log(cheapest[end][end]);
});
