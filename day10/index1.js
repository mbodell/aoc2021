const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let errors = [];
let count = 0;
let incomplete = [];

function value(close) {
  switch(close) {
    case ']': return 57;
    case ')': return 3;
    case '}': return 1197;
    case '>': return 25137;
  }
  console.log("Error");
  return 0;
}
function closeValue(inp) {
  let ret = 0;
  switch(inp) {
    case '(': ret = 1; break;
    case '[': ret = 2; break;
    case '{': ret = 3; break;
    case '<': ret = 4; break;
  }
  return ret;
}
function unexpected(inp,exp) {
  let ret = true;
  if((inp === ")" && exp === "(") || (inp === ">" && exp === "<") 
      || (inp === "]" && exp === "[") || (inp === "}" && exp === "{")) {
    ret = false;
  }
  return ret;
}

eachLine(filename, function(line) {
  let input = [...line];
  let stack = [];
  let done = false;
  for(let i=0;i<input.length&&!done;i++) {
    let expected = "";
    switch(input[i]) {
      case '[':
      case '{':
      case '<':
      case '(':
        stack.push(input[i]);
        break;
      case ']':
      case '}':
      case '>':
      case ')':
        let expected = stack.pop();
        if(unexpected(input[i],expected)) {
          errors.push(input[i]);
          count += value(input[i]);
          done=true;
        }
    }
  }
  if(!done) {
    let c = 0;
    while(stack.length) {
      c *= 5;
      c += closeValue(stack.pop());
    }
    incomplete.push(c);
  }
}).then(function(err) {
  let answer = incomplete.sort((a,b)=>b-a);
  console.log(answer[Math.floor(incomplete.length/2)]);
});
