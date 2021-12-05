const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let lines = [];

eachLine(filename, function(line) {
  lines.push(line.split('->').map(e=>e.split(',').map(f=>Number(f.trim()))));
}).then(function(err) {
  hvlines = lines.filter(e=>(e[0][0]===e[1][0]||e[0][1]===e[1][1]));
  dialines = lines.filter(e=>(e[0][0]!==e[1][0]&&e[0][1]!==e[1][1]));
  let max = lines.map(e=>[Math.max(e[0][0],e[1][0]),Math.max(e[0][1],e[1][1])]).reduce((e,f)=>[Math.max(e[0],f[0]),Math.max(e[1],f[1])]);
  let dia = [...Array(max[0]+1)].map(x=>Array(max[1]+1).fill(0));
  hvlines.forEach(e => {
    if(e[0][0] === e[1][0]) {
      let miny = Math.min(e[0][1],e[1][1]);
      let maxy = Math.max(e[0][1],e[1][1]);
      for(let i=miny;i<=maxy;i++) {
	dia[i][e[0][0]]++;
      }
    } else {
      let minx = Math.min(e[0][0],e[1][0]);
      let maxx = Math.max(e[0][0],e[1][0]);
      for(let i=minx;i<=maxx;i++) {
	dia[e[0][1]][i]++;
      }
    }
  });
  dialines.forEach(e => {
    if(e[0][0]<e[1][0]) {
      if(e[0][1]<e[1][1]) {
	for(let i=0;e[0][0]+i<=e[1][0];i++) {
	  dia[e[0][1]+i][e[0][0]+i]++;
	}
      } else {
	for(let i=0;e[0][0]+i<=e[1][0];i++) {
	  dia[e[0][1]-i][e[0][0]+i]++;
	}
      }
    } else {
      if(e[0][1]<e[1][1]) {
	for(let i=0;e[1][0]+i<=e[0][0];i++) {
	  dia[e[0][1]+i][e[0][0]-i]++;
	}
      } else {
	for(let i=0;e[1][0]+i<=e[0][0];i++) {
	  dia[e[0][1]-i][e[0][0]-i]++;
	}
      }
    }
  });
  let answer = dia.map(e=>e.filter(f=>f>1).length).reduce((a,b)=>a+b);
  console.log(answer);
});
