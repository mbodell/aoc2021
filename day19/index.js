const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let scanners = [];
let scnt = -1;
let sPos = [];
let sOrie = [];
let pPos = [];
let scannersT = [];
let beacon = new Set();

function prepare(j) {
  let ret = [];

  for(let i=0;i<48;i++) {
    if(ret[i]===undefined) {
      ret[i] = [];
    }
    let perm = Math.floor(i/8);
    let sz = (i%2)?-1:1;
    let sy = (Math.floor(i/2)%2)?-1:1;
    let sx = (Math.floor(i/4)%2)?-1:1;
    switch (perm) {
      case 0:
        scanners[j].map(e=>ret[i].push([sx*e[0],sy*e[1],sz*e[2]]));
        break;
      case 1:
        scanners[j].map(e=>ret[i].push([sx*e[0],sy*e[2],sz*e[1]]));
        break;
      case 2:
        scanners[j].map(e=>ret[i].push([sx*e[1],sy*e[0],sz*e[2]]));
        break;
      case 3:
        scanners[j].map(e=>ret[i].push([sx*e[1],sy*e[2],sz*e[0]]));
        break;
      case 4:
        scanners[j].map(e=>ret[i].push([sx*e[2],sy*e[0],sz*e[1]]));
        break;
      case 5:
        scanners[j].map(e=>ret[i].push([sx*e[2],sy*e[1],sz*e[0]]));
        break;
    }
  }
  return ret;
}

function tryMatchScanners(s1,s2) {
  let ret = false;
  console.log(`Try to match ${s1} to ${s2}`);

  let posS2 = scannersT[s2];
  let posS1 = scanners[s1];

  for(let o=0;o<posS2.length;o++) {
    for(let i=0;i<posS2[o].length;i++) {
      for(let j=0;j<posS1.length;j++) {
        let matches = 0;
        let delta = [posS1[j][0]-posS2[o][i][0],
                     posS1[j][1]-posS2[o][i][1],
                     posS1[j][2]-posS2[o][i][2]];
        for(let x=0;x<posS2[o].length;x++) {
          for(let y=0;y<posS1.length;y++) {
            if((posS2[o][x][0]+delta[0] === posS1[y][0] &&
                posS2[o][x][1]+delta[1] === posS1[y][1] &&
                posS2[o][x][2]+delta[2] === posS1[y][2] )) {
              matches++;
            }
          }
        }
        if(matches >= 12) {
          console.log(`For ${o} orientation, ${i} s2 beacon, ${j} s1 beacon, got ${matches} matches`);
          sPos[s2] = [sPos[s1][0]-delta[0],sPos[s1][1]-delta[1],sPos[s1][2]-delta[2]];
          // do something with orientation
          scanners[s2] = posS2[o];
          scanners[s2] = scanners[s2].map(e=>[e[0]+delta[0],e[1]+delta[1],e[2]+delta[2]]);
          scanners[s2].map(e=>pPos.push(e));
          scanners[s2].map(e=>beacon.add(""+e[0]+","+e[1]+","+e[2]));
          console.log(beacon.size);
          sOrie[s2] = o;
          return true;
        }
      }
    }
  }

  return ret;
}

eachLine(filename, function(line) {
  if(line.length !== 0) {
    if (line.indexOf("scanner")>0) {
      scnt++;
    } else {
      if(scanners[scnt] === undefined) {
        scanners[scnt] = [];
      }
      scanners[scnt].push(line.split(",").map(e=>Number(e)));
    }
  }
}).then(function(err) {
  console.log(scnt);
  // Place scanner 0 as the right location
  sPos[0] = [0,0,0];
  sOrie[0] = [[0,1,2],[1,1,1]];
  scanners[0].map(e=>pPos.push(e));
  scanners[0].map(e=>beacon.add(""+e[0]+","+e[1]+","+e[2]));
  console.log(beacon.size);

  let scanToMatch = [];
  scanToMatch.push(0);

  for(let i=1;i<scanners.length;i++) {
    scannersT[i] = prepare(i);
  }

  while(scanToMatch.length>0) {
    let i=scanToMatch.pop();
    for(let c=0;c<scanners.length;c++) {
      if (sPos[c] === undefined) {
        let mat = tryMatchScanners(i,c);
        if(mat === true) {
          scanToMatch.push(c);
          console.log(`Got match for ${c}`);
        }
      }
    }
  }

  console.log(beacon.size);
});
