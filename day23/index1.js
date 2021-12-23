const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let maze = [];
let rep = [];
let energy = [];
let minPath = 0;
let costA = 1;
let costB = 10;
let costC = 100;
let costD = 1000;
let cost = [];
cost['A'] = 1;
cost['B'] = 10;
cost['C'] = 100;
cost['D'] = 1000;
cost['.'] = 0;
let pos = [];
pos['A'] = 2;
pos['B'] = 4;
pos['C'] = 6;
pos['D'] = 8;
pos['.'] = 0;
let letter = [];
letter[2] = 'A';
letter[4] = 'B';
letter[6] = 'C';
letter[8] = 'D';


function solvep(p) {
  return (p[2][0] === "A" && 
          p[2][1] === "A" && 
          p[2][2] === "A" && 
          p[2][3] === "A" && 
          p[4][0] === "B" && 
          p[4][1] === "B" &&
          p[4][2] === "B" &&
          p[4][3] === "B" &&
          p[6][0] === "C" && 
          p[6][1] === "C" &&
          p[6][2] === "C" &&
          p[6][3] === "C" &&
          p[8][0] === "D" && 
          p[8][1] === "D" && 
          p[8][2] === "D" && 
          p[8][3] === "D");
}

function deepCopy(p) {
  let c = [...p];
  c[2] = [...p[2]];
  c[4] = [...p[4]];
  c[6] = [...p[6]];
  c[8] = [...p[8]];
  return c;
}

function caveS(p) {
  return "" + p[0] + "," + p[1] + ",(" + p[2][0] + "," + p[2][1] + "," + p[2][2] + "," + p[2][3] + ")," + p[3] + ",(" + p[4][0] + "," + p[4][1] + "," + p[4][2] + "," + p[4][3] + ")," + p[5] + ",(" + p[6][0] + "," + p[6][1] + "," + p[6][2] + "," + p[6][3] + ")," + p[7] + ",(" + p[8][0] + "," + p[8][1] + "," + p[8][2] + "," + p[8][3] + ")," + p[9] + "," + p[10]; 
}

function errorEst(p) {
  let e = 0;
  for(let i=0;i<11;i++) {
    if(i!==2&&i!==4&&i!==6&&i!==8) {
      e += (Math.abs(pos[p[i]]-i)+1)*cost[p[i]];
    } else {
      for(let j=0;j<4;j++) {
        if(pos[p[i][j]]!==i) {
          e += (Math.abs(pos[p[i][j]]-i)+2+j)*cost[p[i][j]];
        }
      }
    }
  }
  return e;
}

function hallp(i) {
  return ((i%2)===1||i===0||i==10);
}

function track(p,c) {
  let est = c;
  // A* it up with a best case estimate
  est += errorEst(p);
  if(energy[est] === undefined) {
    energy[est] = [];
  }
  energy[est].push([p,c]);
  console.log(`At path length cost ${c} estimate ${est} cave ${caveS(p)}`);
}

function legalMove(p,i,j) {
  let ret = true;
  let piece = getPiece(p,i);
  if(piece === '.') {
    ret = false;
  } else {
    let dest = getVertD(p,j);
    if(!hallp(j)&&p[j][dest]!=='.') {
      ret = false;
    } else {
      let mini = Math.min(i,j);
      let maxi = Math.max(i,j);
      for(let k=mini+1;k<maxi&&ret===true;k++) {
        if(hallp(k)&&p[k]!=='.') {
          ret = false;
        }
      }
      if(hallp(j)&&p[j]!=='.') {
        ret = false;
      }
    }
  }
  if(ret) {
    if(!hallp(j)) {
      if(letter[j]!==piece) {
        ret = false;
      }
      for(let k=0;k<4&&ret===true;k++) {
        if(p[j][k]!=='.'&&p[j][k]!==letter[j]) {
          ret = false;
        }
      }
    }
  }
  if(ret) {
    if(hallp(i)) {
      if(j!==pos[piece]) {
        ret = false;
      }
    }
  }
  if(ret) {
    if(!hallp(i)) {
      ret = false;
      for(let k=0;k<4;k++) {
        if(p[i][k]!=='.'&&p[i][k]!==letter[i]) {
          ret = true;
        }
      }
    }
  }
  return ret;
}

function getVert(p,i) {
  let ret = -1;
  if(!hallp(i)) {
    for(let j=0;j<4&&ret===-1;j++) {
      if(p[i][j]!=='.') {
        ret = j;
      }
    }
  }
  if(ret===-1) {ret = 0}
  return ret;
}

function getPiece(p,i) {
  let ret = 0;
  let vert = getVert(p,i);
  if(hallp(i)) {
    ret = p[i];
  } else {
    ret = p[i][vert];
  }
  return ret;
}

function getVertD(p,i) {
  let ret = 0;
  if(!hallp(i)) {
    for(let j=0;j<4;j++) {
      if(p[i][j]==='.') {
        ret = j;
      }
    }
  }
  return ret;
}

function expand(p, c) {
  let copy = deepCopy(p);

  for(let i=0;i<11;i++) {
    for(let j=0;j<11;j++) {
      if(i!==j) {
        if(legalMove(p,i,j)) {
          let piece = getPiece(p,i);
          let verti = getVert(p,i);
          let vertj = getVertD(p,j);
          copy = deepCopy(p);
          if(!hallp(j)) {
            copy[j][vertj] = piece;
            vertj++;
          } else {
            copy[j] = piece;
          }
          if(!hallp(i)) {
            copy[i][verti] = '.';
            verti++;
          } else {
            copy[i] = '.';
          }
          let moveCost = (Math.abs(i-j)+verti+vertj)*cost[piece];
          track(copy,c+moveCost);
        }
      }
    }
  }
}


eachLine(filename, function(line) {
  maze.push(line);
}).then(function(err) {
  rep = new Array(11).fill('.');
  rep[2] = [maze[2][3],'D','D',maze[3][3]];
  rep[4] = [maze[2][5],'C','B',maze[3][5]];
  rep[6] = [maze[2][7],'B','A',maze[3][7]];
  rep[8] = [maze[2][9],'A','C',maze[3][9]];
  energy[0] = [];
  energy[0].push([rep,0]);
  console.log(maze);
  console.log(rep);
  console.log(caveS(rep));
  while(answer===0) {
    let found = false;
    for(let i=0;!found;i++) {
      if(energy[i] !== undefined && energy[i].length>0) {
        let e = energy[i].pop();
        let path = e[0];
        let costE = e[1];
        minPath = i;
        found = true;
        //console.log(`I found ${caveS(path)} with cost ${costE} at i ${i}`);
        if(solvep(path)) {
          answer=costE;
        } else {
          expand(path,costE);
        }
      }
    }
  }
  console.log(answer);
});
