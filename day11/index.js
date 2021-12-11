const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let errors = [];
let count = 0;

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
}).then(function(err) {
  console.log(count);
});
