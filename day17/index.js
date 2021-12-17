const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = 0;
eachLine(filename, function(line) {
  let it = line.match(/(-?\d+)\.\.(-?\d+)/g);
  let x = it[0].split("..").map(e=>Number(e));
  minX = x[0];
  maxX = x[1];
  if(minX>maxX) {
    maxX = x[0];
    minX = x[1];
  }
  x = it[1].split("..").map(e=>Number(e));
  minY = x[0];
  maxY = x[1];
  if(minY>maxY) {
    minY = x[1];
    maxY = x[0];
  }
  console.log(`From x=${minX} to ${maxX} and y=${minY} to ${maxY}`);
}).then(function(err) {
  // Assume the target area allows us to drop in
  // missle stops motion at the sum of the first x motions
  // And missle always crosses y=0 again, maxium y
  // is when second y is after the x motion stopped and y takes us directly
  // from 0 to bottom of our range
  let x = 0;
  let sum=0;
  for(;sum<minX;x++) {
    sum+=x;
  }
  x--;
  if(sum>maxX) {
    // there is no good drop dead value
    console.log("need better algo");
  }
  let y = -minY-1;
  console.log(`The right maximum is (${x},${y})`);
  // y is at a maximum after y steps
  // The general formula for the y value of a missle after s steps
  // doesn't depend on x but is:
  // step*(y-(step-1)/2) 
  // and since the maximum happens at step===y:
  let answer = y*(y-(y-1)/2);
  console.log(`The maximum was ${answer}`);
});
