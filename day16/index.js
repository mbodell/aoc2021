const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let bits = [];

let vCount = 0;

let packets = [];

function readBits(ind, num) {
  let ret = 0;
  for(let i=0;i<num;i++) {
    ret *=2;
    ret += bits[ind+i];
  }
  return ret;
}

function parsePacket(ind) {
  let version = readBits(ind, 3);
  let origInd = ind;
  vCount += version;
  console.log(`Packet version ${version} and count is now ${vCount}`);
  ind += 3;
  let type = readBits(ind, 3);
  console.log(`Package type ${type}`);
  ind += 3;
  if(type === 4) {
    // It's a number
    let num = 0;
    for(num = readBits(ind+1,4);bits[ind]===1;ind+=5) {
      num *= 16;
      num += readBits(ind+6,4);
    }
    ind += 5;
    console.log(`Literal is ${num}`);
  } else {
    // It's an operator
    let len = bits[ind];
    ind++;
    console.log(`Length type ID is ${len}`);
    if(len===0) {
      // length in bits of the sub
      let size = readBits(ind, 15);
      console.log(`The bits to read are ${size}`);
      ind += 15;
      let processed = 0;
      while(processed < size) {
        let pSize = parsePacket(ind);
        console.log(`Processed a package of ${pSize} size`);
        ind += pSize;
        processed += pSize;
      }
    } else {
      // num of packets in the sub
      let num = readBits(ind, 11);
      console.log(`The packets in the sub are ${num}`);
      ind += 11;
      for(let i=0;i<num;i++) {
        let pSize = parsePacket(ind);
        console.log(`Processed a package of ${pSize} size`);
        ind += pSize;
      }
    }
  }
  let totSize = ind - origInd;
  console.log(`Started package at ${origInd} and finished at ${ind} for ${totSize}`);
  return totSize;
}

eachLine(filename, function(line) {
  let letters = line.split("");
  for(let i=0;i<letters.length;i++) {
    let digits = parseInt(letters[i],16).toString(2).split("").map(e=>Number(e));
    for(let j=4-digits.length;j>0;j--) {
      bits=bits.concat([0]);
    }
    bits = bits.concat(digits);
  }
}).then(function(err) {
  console.log(bits);
  parsePacket(0);
  console.log(vCount);
});
