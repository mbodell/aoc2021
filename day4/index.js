const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let balls = [];
let boards = [];
let index = -1;
let boardIndex = 0;

eachLine(filename, function(line) {
  if(line.length > 0) {
    if(index == -1) {
      balls = line.split(",").map(e => Number(e));
      index++;
    } else {
      if(boardIndex == 0) { boards[index] = []; }
      boards[index][boardIndex] = line.match(/\s*(\d+)\s*/g).map(e => Number(e.trim()));
      boardIndex++;
      if(boardIndex == 5) { boardIndex = 0; index++; }
    }
  }
}).then(function(err) {
  let bwin = 0;
  let b=0;
  let bsum = 0;
  let bv=0;
  for(b=0;b<balls.length&&bwin===0;b++) {
    bv = balls[b];
    for(let bo=0;bo<boards.length&&bwin===0;bo++) {
      for(let x=0; x<5&&bwin===0; x++) {
	for(let y=0; y<5&&bwin===0; y++) {
	  if(boards[bo][x][y] === bv) {
	    boards[bo][x][y] = "X";
	    let test = true;
	    for(let tx=0; tx<5&&test; tx++) {
              if(boards[bo][tx][y] !== "X") { test = false; }
	    }
	    if(!test) {
	      test = true;
	      for(let ty=0; ty<5&&test; ty++) {
		if(boards[bo][x][ty] !== "X") {test = false; }
	      }
	    }
	    if(test) {
	      bwin = 1;
	      for(let fx=0;fx<5;fx++) {
		for(let fy=0;fy<5;fy++) {
		  if(boards[bo][fx][fy] !== "X") {
		    bsum += boards[bo][fx][fy];
		  }
		}
	      }
	    }
	  }
	}
      }
    }
  }
  console.log(bsum*bv);
});
