const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';
let total = -1;
let last = -1;

eachLine(filename, function(line) {
	if(last < Number(line)) {
		total++;
	}
	last = Number(line);
}).then(function(err) {
  console.log(total);
});
