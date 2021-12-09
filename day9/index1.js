const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let caves = [];
let basins = [];


eachLine(filename, function(line) {
  caves.push([...line].map(e=>Number(e)));
}).then(function(err) {
  let w = caves[0].length;
  let h = caves.length;

  for(let i=0;i<w;i++) {
    for(let j=0;j<h;j++) {
      let t = caves[j][i];
      if( (j===0||t<caves[j-1][i]) && (j===(h-1)||t<caves[j+1][i]) 
        && (i===0||t<caves[j][i-1]) && (i===(w-1)||t<caves[j][i+1]) ) {
        let basin = [];
        let candidates = [];
        basin.push([j,i]);
        candidates.push([j-1,i],[j+1,i],[j,i-1],[j,i+1]);
        let done = false;
        while(!done) {
          done = true;
          candidates = candidates.filter(e=>e[0]>=0&&e[0]<h&&e[1]>=0&&e[1]<w);
          candidates = candidates.filter(e=>!basin.some(f=>f[0]===e[0]&&f[1]===e[1]));
          candidates = candidates.filter(e=>caves[e[0]][e[1]]!==9);
          if (candidates.length>0) {
            done = false;
            let newC = [];
            for(let c=0; c<candidates.length; c++) {
              let ti = candidates[c][1];
              let tj = candidates[c][0];
              let newCU = [];
              newCU.push([tj-1,ti],[tj+1,ti],[tj,ti-1],[tj,ti+1]);
              newCU = newCU.filter(e=>!newC.some(f=>f[0]===e[0]&&f[1]===e[1]));
              newC = newC.concat(newCU);
            }
            basin = basin.concat(candidates);
            candidates = newC;
          }
        }
        basins.push(basin);
      }
    }
  }
  let counts = basins.map(e=>e.length).sort((a,b)=>b-a);
  let fin = counts[0]*counts[1]*counts[2];
  console.log(fin);
});
