const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let numbers = [];
let depths = [];
let maxMagnitude = -1;

function AddNum(cN, cD, i) {
  for(let j=0; j<numbers[i].length;j++) {
    cN.push(numbers[i][j]);
    cD.push(depths[i][j]);
  }
  for(let j=0; j<cD.length;j++) {
    cD[j]++;
  }
}

function ReduceNum(cN, cD) {
  let done = false;
  while(!done) {
    done = true;
    let stop = false;
    for(let i=0;i<cD.length&&!stop;i++) {
      if(cD[i] > 4) {
        stop = true;
        done = false;
        // Explode pair
        if(i>0) {
          cN[i-1] += cN[i];
        }
        if(i+2<cD.length) {
          cN[i+2] += cN[i+1];
        }
        cN.splice(i,1);
        cD.splice(i,1);
        cN[i] = 0;
        cD[i]--;
      }
    }
    for(let i=0;i<cN.length&&!stop;i++) {
      if(cN[i] > 9) {
        stop = true;
        done = false;
        // split numbers;
        let num = cN[i]/2;
        cN.splice(i,0,0);
        cN[i] = Math.floor(num);
        cN[i+1] = Math.ceil(num);
        cD[i]++;
        cD.splice(i,0,cD[i]);
      }
    }
  }
}

function getMagnitude(cN,cD) {
  let done = false;
  while(!done) {
    done = true;
    let stop = false;
    for(let i=0;!stop&&i+1<cN.length; i++) {
      if(cD[i]===cD[i+1]) {
        done = false;
        stop = true;
        let num = 3*cN[i]+2*cN[i+1];
        cN.splice(i,1);
        cD.splice(i,1);
        cN[i] = num;
        cD[i]--;
      }
    }
  }
}

eachLine(filename, function(line) {
  let number = [];
  let depth = [];
  let l = [...line];
  let d = 0;
  for(let i=0;i<l.length;i++){
    switch(l[i]) {
      case '[':
        d++;
        break;
      case ']':
        d--;
        break;
      case ',':
        break;
      default:
        number.push(Number(l[i]));
        depth.push(d);
        break;
    }
  }
  numbers.push(number);
  depths.push(depth);
}).then(function(err) {
  for(let x=0;x<numbers.length;x++) {
    for(let y=0;y<numbers.length;y++) {
      if(x!==y) {
        let curNum = [];
        let curDepth = [];
        for(let i=0;i<numbers[x].length;i++) {
          curNum[i] = numbers[x][i];
          curDepth[i] = depths[x][i];
        }
        AddNum(curNum, curDepth, y);
        ReduceNum(curNum, curDepth);
        getMagnitude(curNum, curDepth);
        if(maxMagnitude<curNum[0]) {
          maxMagnitude = curNum[0];
        }
      }
    }
  }
  console.log(maxMagnitude);
});
