const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let total = 0;

eachLine(filename, function(line) {
  let input, output;
  let temp = line.split(" | ").map(e=>e.split(" ").map(f=>[...f].sort().reduce((a,b)=>a+b)));
  input = temp[0], output = temp[1];
  let numbers=[];
  // solve the obvious ones
  numbers[1] = input.filter(e=>e.length===2)[0];
  numbers[7] = input.filter(e=>e.length===3)[0];
  numbers[8] = input.filter(e=>e.length===7)[0];
  numbers[4] = input.filter(e=>e.length===4)[0];
  // use the el part of the 4 not in the one for later
  let el = [...numbers[4]].filter(e=>numbers[1].search(e)===-1);
  // solve the 0, 6, 9 that have 6 parts
  let sixL = input.filter(e=>e.length===6);
  numbers[0] = sixL.filter(f=>f.search(el[0])===-1 || f.search(el[1])===-1)[0];
  numbers[6] = sixL.filter(f=>f.search(numbers[1][0])===-1 || f.search(numbers[1][1])===-1)[0];
  numbers[9] = sixL.filter(f=>f!==numbers[0]&&f!==numbers[6])[0];
  // solve the 3, 5, 2 that have 5 parts
  let fiveL = input.filter(e=>e.length===5);
  numbers[3] = fiveL.filter(f=>f.search(numbers[1][0])!==-1&&f.search(numbers[1][1])!==-1)[0];
  numbers[5] = fiveL.filter(f=>f.search(el[0])!==-1&&f.search(el[1])!==-1)[0];
  numbers[2] = fiveL.filter(f=>f!==numbers[3]&&f!==numbers[5])[0];
  let res = 0;
  let m = 1000;
  for(let i=0;i<4;i++) {
    for(let j=0;j<10;j++) {
      if(output[i]===numbers[j]) {
	res += m * j;
	m /= 10;
      }
    }
  }
  total += res;
}).then(function(err) {
  console.log(total);
});
