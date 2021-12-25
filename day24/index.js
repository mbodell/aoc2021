const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let instr = [];

let register = [];
let registers = ['w','x','y','z'];

let input = 0;

let answer = 0;

function noZero(i) {
  let s = "";
  s += i;
  let ret = true;
  for(let j=0;j<s.length&&ret;j++) {
    if(s[j]==='0') {
      ret = false;
    }
  }
  return ret;
}

function showRegisters() {
  let ret = "";
  for(let i=0;i<registers.length;i++) {
    ret += "(" + registers[i] + ":" + register[registers[i]] + ") ";
  }
  return ret;
}

function runProgram(n) {
  // initiate the registers
  for(let j=0;j<registers.length;j++) {
    register[registers[j]] = 0;
  }
  // run program
  let s = "";
  s += n;

  s = s.split('').map(e=>Number(e));

  for(let i=0;i<instr.length;i++) {
    let ins = instr[i];
    //console.log(`ins is ${ins} and current input is ${s} and registers are ${showRegisters()}`);
    switch(ins[0]) {
      case 'inp':
        register[ins[1]] = s.splice(0,1)[0];
        break;
      case 'add':
        register[ins[1]] += register[ins[2]];
        break;
      case 'addn':
        register[ins[1]] += ins[2];
        break;
      case 'mul':
        register[ins[1]] *= register[ins[2]];
        break;
      case 'muln':
        register[ins[1]] *= ins[2];
        break;
      case 'div':
      case 'divn':
        let d = register[ins[1]]/((ins[0]==='div')?register[ins[2]]:ins[2]);
        if(d>0) {
          d = Math.floor(d);
        } else {
          d = Math.ceil(d);
        }
        register[ins[1]] = d;
        break;
      case 'mod':
        register[ins[1]] = register[ins[1]] % register[ins[2]];
        break;
      case 'modn':
        register[ins[1]] = register[ins[1]] % ins[2];
        break;
      case 'eql':
        register[ins[1]] = (register[ins[1]]===register[ins[2]])?1:0;
        break;
      case 'eqln':
        register[ins[1]] = (register[ins[1]]===ins[2])?1:0;
        break;
    }
  }
  let ret = false;
  if(register['z']===0) {
    ret = true;
  }
  return ret;
}

eachLine(filename, function(line) {
  let ins = line.split(" ");
  if(ins[0] === 'inp') {
    instr.push([ins[0],ins[1]]);
    input++;
  } else {
    if(ins[2] === 'w' || ins[2] === 'x' || ins[2] === 'y' || ins[2] === 'z') {
      instr.push([ins[0],ins[1],ins[2]]);
    } else {
      instr.push([ins[0]+"n",ins[1],Number(ins[2])]);
    }
  }
}).then(function(err) {
  console.log(instr);
  let inp = "";
  for(let i=0;i<input;i++) {
    inp += '9';
  }
  let done = false;
  inp = Number(inp);
  for(let i=inp;i>=0&&!done;i--) {
    if(noZero(i)) {
      done = runProgram(i);
      if(done) {
        answer = i;
      }
    }
  }
  console.log(answer);
});
