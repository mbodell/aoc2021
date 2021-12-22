const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0n;

let dir = [];
let x =[];
let y = [];
let z = [];

let unBox = [];
let rawBox = [];

function area(b) {
  let sx = BigInt(b[1][0]-b[0][0]+1);
  let sy = BigInt(b[1][1]-b[0][1]+1);
  let sz = BigInt(b[1][2]-b[0][2]+1);
  return sx*sy*sz;
}

function noOverlap(a,b) {
  let ret = true;
  let sizeX = Math.max(Math.min(a[1][0],b[1][0])-Math.max(a[0][0],b[0][0]),-1);
  let sizeY = Math.max(Math.min(a[1][1],b[1][1])-Math.max(a[0][1],b[0][1]),-1);
  let sizeZ = Math.max(Math.min(a[1][2],b[1][2])-Math.max(a[0][2],b[0][2]),-1);
  let size = Math.min(sizeX,sizeY,sizeZ);
  if(size === -1) {
    ret = true;
  } else {
    ret = false;
  }
  return ret;
}

function explode(box,ind) {
  let unB = unBox.splice(ind,1)[0];
  // first cut X
  let tx1 = unB[0][0];
  let tx2 = unB[1][0];
  let cutX = [];
  let a=0,b=0;
  if(tx1<box[0][0]&&box[0][0]<=tx2) {
    cutX.push(box[0][0]);
    a++;
  }
  if(tx1<=box[1][0]&&box[1][0]<tx2) {
    cutX.push(box[1][0]);
    b++;
  }
  if(cutX.length===2) {
    unBox.push([[unB[0][0],unB[0][1],unB[0][2]],[cutX[0]-1,unB[1][1],unB[1][2]],unB[2]]);
    unBox.push([[cutX[1]+1,unB[0][1],unB[0][2]],[unB[1][0],unB[1][1],unB[1][2]],unB[2]]);
    unB = [[cutX[0],unB[0][1],unB[0][2]],[cutX[1],unB[1][1],unB[1][2]],unB[2]];
  } else if(cutX.length===1) {
    if(a===1) {
      unBox.push([[unB[0][0],unB[0][1],unB[0][2]],[cutX[0]-1,unB[1][1],unB[1][2]],unB[2]]);
      unB = [[cutX[0],unB[0][1],unB[0][2]],[unB[1][0],unB[1][1],unB[1][2]],unB[2]]; 
    } else {
      unBox.push([[cutX[0]+1,unB[0][1],unB[0][2]],[unB[1][0],unB[1][1],unB[1][2]],unB[2]]);
      unB = [[unB[0][0],unB[0][1],unB[0][2]],[cutX[0],unB[1][1],unB[1][2]],unB[2]]; 
    }
  } else {
    // Move to next as there is none to keep
  }
  // then cut Y
  let ty1 = unB[0][1];
  let ty2 = unB[1][1];
  let cutY = [];
  a=0,b=0;
  if(ty1<box[0][1]&&box[0][1]<=ty2) {
    cutY.push(box[0][1]);
    a++;
  }
  if(ty1<=box[1][1]&&box[1][1]<ty2) {
    cutY.push(box[1][1]);
    b++;
  }
  if(cutY.length===2) {
    unBox.push([[unB[0][0],unB[0][1],unB[0][2]],[unB[1][0],cutY[0]-1,unB[1][2]],unB[2]]);
    unBox.push([[unB[0][0],cutY[1]+1,unB[0][2]],[unB[1][0],unB[1][1],unB[1][2]],unB[2]]);
    unB = [[unB[0][0],cutY[0],unB[0][2]],[unB[1][0],cutY[1],unB[1][2]],unB[2]];
  } else if(cutY.length===1) {
    if(a===1) {
      unBox.push([[unB[0][0],unB[0][1],unB[0][2]],[unB[1][0],cutY[0]-1,unB[1][2]],unB[2]]);
      unB = [[unB[0][0],cutY[0],unB[0][2]],[unB[1][0],unB[1][1],unB[1][2]],unB[2]]; 
    } else {
      unBox.push([[unB[0][0],cutY[0]+1,unB[0][2]],[unB[1][0],unB[1][1],unB[1][2]],unB[2]]);
      unB = [[unB[0][0],unB[0][1],unB[0][2]],[unB[1][0],cutY[0],unB[1][2]],unB[2]]; 
    }
  } else {
    // Move to next as there is none to keep
  }
  // Then cut Z
  let tz1 = unB[0][2];
  let tz2 = unB[1][2];
  let cutZ = [];
  a=0,b=0;
  if(tz1<box[0][2]&&box[0][2]<=tz2) {
    cutZ.push(box[0][2]);
    a++;
  }
  if(tz1<=box[1][2]&&box[1][2]<tz2) {
    cutZ.push(box[1][2]);
    b++;
  }
  if(cutZ.length===2) {
    unBox.push([[unB[0][0],unB[0][1],unB[0][2]],[unB[1][0],unB[1][1],cutZ[0]-1],unB[2]]);
    unBox.push([[unB[0][0],unB[0][1],cutZ[1]+1],[unB[1][0],unB[1][1],unB[1][2]],unB[2]]);
    unB = [[unB[0][0],unB[0][1],cutZ[0]],[unB[1][1],unB[1][1],cutZ[2]],unB[2]];
  } else if(cutZ.length===1) {
    if(a===1) {
      unBox.push([[unB[0][0],unB[0][1],unB[0][2]],[unB[1][0],unB[1][1],cutZ[0]-1],unB[2]]);
      unB = [[unB[0][0],unB[0][1],cutZ[0]],[unB[1][0],unB[1][1],unB[1][2]],unB[2]]; 
    } else {
      unBox.push([[unB[0][0],unB[0][1],cutZ[0]+1],[unB[1][0],unB[1][1],unB[1][2]],unB[2]]);
      unB = [[unB[0][0],unB[0][1],unB[0][2]],[unB[1][0],unB[1][1],cutZ[0]],unB[2]]; 
    }
  } else {
    // Move to next as there is none to keep
  }
  // Try the box again
  rawBox.unshift(box);
}

eachLine(filename, function(line) {
  let p = line.split("=");
  dir.push(p[0].split(" ")[0]);
  x.push(p[1].split(",")[0].split("..").map(e=>Number(e)));
  y.push(p[2].split(",")[0].split("..").map(e=>Number(e)));
  z.push(p[3].split("..").map(e=>Number(e)));
}).then(function(err) {
  for(let i=0;i<dir.length;i++) {
    rawBox.push([[x[i][0],y[i][0],z[i][0]],[x[i][1],y[i][1],z[i][1]],dir[i]]);
  }
  while(rawBox.length>0) {
    let box = rawBox.shift();
    let unique = true;
    for(let i=0;i<unBox.length&&unique;i++) {
      unique = noOverlap(box,unBox[i]);
      if(!unique) {
        explode(box,i);
      }
    }
    if(unique && box[2]==="on") {
      unBox.push(box);
    }
  }
  // validate no collisions
  for(let i=0;i<unBox.length;i++) {
    for(let j=i+1;j<unBox.length;j++) {
      let unique = noOverlap(unBox[i],unBox[j]);
      if(!unique) {
        console.log(`Validation failed (${i},${j}) with ${unBox[i]}+${unBox[j]}`);
      }
    }
  }

  for(let i=0;i<unBox.length;i++) {
    answer += area(unBox[i]);
  }
  console.log(answer);
});
