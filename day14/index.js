const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let grid = [];
let points = [];
let folds = [];

eachLine(filename, function(line) {
  if(line.indexOf(",")>=0) {
    points.push(line.split(",").map(e=>Number(e)));
  } else if (line.indexOf("=")>=0) {
    let inst = line.split("=");
    let f = [];
    f[0] = inst[0].charAt(inst[0].length-1);
    f[1] = inst[1];
    folds.push(f);
  }
}).then(function(err) {
  let maxX = -1;
  let maxY = -1;
  points.map(e=>(maxX = (maxX>e[0])?maxX:e[0], maxY = (maxY>e[1])?maxY:e[1]));
  grid = new Array(maxY+1).fill(".").map(()=>new Array(maxX+1).fill("."));
  // Place dots
  points.map(e=>grid[e[1]][e[0]] = "#");
  // Do folds
  for(let i=0;i<1/*folds.length*/;i++) {
    let newGrid = [];
    if(folds[i][0] === "x") {
      omx = maxX;
      maxX = maxX/2-1;
      newGrid = new Array(maxY+1).fill(".").map(()=> new Array(maxX+1).fill("."));
      for(let y=0;y<=maxY;y++) {
        for(let x=0;x<=maxX;x++) {
          if(grid[y][x] === "#" || grid[y][omx-x] === "#") {
            newGrid[y][x] = "#";
          }
        }
      }
    } else {
      omy = maxY;
      maxY = maxY/2-1;
      newGrid = new Array(maxY+1).fill(".").map(()=> new Array(maxX+1).fill("."));
      for(let y=0;y<=maxY;y++) {
        for(let x=0;x<=maxX;x++) {
          if(grid[y][x] === "#" || grid[omy-y][x] === "#") {
            newGrid[y][x] = "#";
          }
        }
      }
    }
    grid=newGrid;
  }
  // count "#"
  let count = grid.map(e=>e.filter(f=>f==="#").length).reduce((a,b)=>a+b);
  console.log(count);
});
