const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let dir = [];
let x =[];
let y = [];
let z = [];

eachLine(filename, function(line) {
  let p = line.split("=");
  dir.push(p[0].split(" ")[0]);
  x.push(p[1].split(",")[0].split("..").map(e=>Number(e)));
  y.push(p[2].split(",")[0].split("..").map(e=>Number(e)));
  z.push(p[3].split("..").map(e=>Number(e)));
}).then(function(err) {
/*  console.log(dir);
  console.log(x);
  console.log(y);
  console.log(z);*/
  let lights = new Set();
  for(let i=0;i<dir.length;i++) {
    if( 
      (x[i][0]<-50 && x[i][1]<-50) ||
      (x[i][0]>50 && x[i][1]>50) ||
      (y[i][0]<-50 && y[i][1]<-50) ||
      (y[i][0]>50 && y[i][1]>50) ||
      (z[i][0]<-50 && z[i][1]<-50) ||
      (z[i][0]>50 && z[i][1]>50)) {
     // skip for now
    } else { 
      // These intersect so chop them to edges if needed
      x[i][0]=Math.min(Math.max(x[i][0],-50),50);
      x[i][1]=Math.min(Math.max(x[i][1],-50),50);
      y[i][0]=Math.min(Math.max(y[i][0],-50),50);
      y[i][1]=Math.min(Math.max(y[i][1],-50),50);
      z[i][0]=Math.min(Math.max(z[i][0],-50),50);
      z[i][1]=Math.min(Math.max(z[i][1],-50),50);
      for(let a=x[i][0];a<=x[i][1];a++) {
        for(let b=y[i][0];b<=y[i][1];b++) {
          for(let c=z[i][0];c<=z[i][1];c++) {
            let cube = ""+a+","+b+","+c;
            if(dir[i]==="on") {
              lights.add(cube);
            } else {
              lights.delete(cube);
            }
          }
        }
      }
    }
  }
  answer = lights.size;
  console.log(answer);
});
