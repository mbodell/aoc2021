const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = 0;
let largest = 0;

let targets = [];

function addPaths(s) {
  targets[s] = [];
  let LminX = -1;
  let LmaxX = -1;
  for(let x=0;x<=maxX;x++) {
    let xpos;
    if(s<x) {
      xpos = s*(x-(s-1)/2);
    } else {
      xpos = x*(x-(x-1)/2);
    }
    if(LminX===-1) {
      if(xpos>=minX && xpos<=maxX) {
        LminX = x;
      }
    }
    if(xpos>=minX && xpos<=maxX) {
      LmaxX = x;
    }
  }
  let LminY = minY-1;
  let LmaxY = minY-1;
  for(let y=minY;y<Math.abs(minY);y++) {
    let ypos = s*(y-(s-1)/2);
    if(LminY===(minY-1)) {
      if(ypos>=minY && ypos <=maxY) {
        LminY = y;
      }
    }
    if(ypos>=minY && ypos <=maxY) {
      LmaxY = y;
    }
  }

  for(let x=LminX;x!==-1&&x<=LmaxX;x++) {
    for(let y=LminY;y!==minY-1&&y<=LmaxY;y++) {
      targets[s].push([x,y]);
    }
  }
}

eachLine(filename, function(line) {
  let it = line.match(/(-?\d+)\.\.(-?\d+)/g);
  let x = it[0].split("..").map(e=>Number(e));
  // WOLOG x is always positive
  minX = Math.abs(x[0]);
  maxX = Math.abs(x[1]);
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
  largest = Math.max(maxX,Math.abs(minY),Math.abs(maxY));
  console.log(`Largest is ${largest}`);
}).then(function(err) {
  // Find the path by step size
  // We know that x will stop motion after step amounts
  // We know that y will hit 0 before going down and doesn't depend on x
  // we can have at most 2 times largest
  let steps;
  for(steps=1;steps<2*largest;steps++) {
    addPaths(steps);
  }
  let answer = targets.map(e=>e.length).reduce((a,b)=>a+b);
  console.log(`There are ${answer} paths total that hit the target after fixed steps`);
  let s = new Set();
  targets.map(e=>e.map(f=>s.add("" +f[0]+ "," + f[1])));
  console.log(`But only ${s.size} unique starting aims`);
});
