const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let steps = process.argv.slice(3)[0] || 2;
steps = Number(steps);

let answer = 0;
let ea = [];

let image = [];

let state = 0;

eachLine(filename, function(line) {
  if(state===0) {
    ea = line.split("").map(e=>(e==='.')?'0':'1');
    state++;
  } else {
    if(line.length > 0) {
      image.push(line.split("").map(e=>(e==='.')?'0':'1'));
    }
  }
}).then(function(err) {
  let img = [];
  for(let i=0;i<image.length+2*(steps+1)*(steps+1);i++) {
    for(let j=0;j<image[0].length+2*(steps+1)*(steps+1);j++) {
      if(j===0) {
        img[i] = [];
      }
      if((j<(steps+1)*(steps+1)) ||
         (j>=(image[0].length+(steps+1)*(steps+1))) ||
         (i<(steps+1)*(steps+1)) ||
         (i>=(image.length+(steps+1)*(steps+1))) ) {
        img[i][j] = '0';
      } else {
        img[i][j] = image[i-((steps+1)*(steps+1))][j-((steps+1)*(steps+1))];
      }
    }
  }

  let imgs = [];
  imgs.push(img);

  for(let s=0;s<steps;s++) {
    let next = [];
    for(let y=0;y<imgs[s].length;y++) {
      for(let x=0;x<imgs[s][y].length;x++ ) {
        if(x===0) {
          next[y] = [];
        }
        let num = "";
        for(let dy = -1; dy <= 1; dy++) {
          for(let dx = -1; dx <=1; dx++) {
            let my = y+dy;
            let mx = x+dx;
            if(mx<0||mx>=imgs[s][y].length||my<0||my>=imgs[s].length) {
              if(ea[0] === '0') {
                num += '0';
              } else if((s%2===1)) {
                num += '1';
              } else {
                num += '0';
              }
            } else {
              num += imgs[s][my][mx];
            }
          }
        }
        next[y][x] = ea[parseInt(num,2)];
      }
    }
    imgs.push(next);
  }

  answer = imgs[steps].map(e=>e.filter(f=>f==='1').length).reduce((a,b)=>a+b);

  console.log(answer);
});
