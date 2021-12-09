const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let caves = [];
let risks = 0;

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
        risks += t+1;
      }
    }
  }
  console.log(risks);
});
