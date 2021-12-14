const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let template = "";

let inst = [];

let firstline = -1;

eachLine(filename, function(line) {
  if(firstline === -1) {
    template = line;
    firstline++;
  } else {
    let instruct = line.split(" -> ");
    if(instruct.length > 1) {
      inst[instruct[0]] = instruct[1];
    }
  }
}).then(function(err) {
  for(let step=0;step<10;step++) {
    let newTemp = "";
    for(let c=0;c<template.length-1;c++) {
      newTemp += template[c] + inst[template.substr(c,2)]; 
    }
    newTemp += template[template.length-1];
    template = newTemp;
  }
  // count the letters
  let count = [...template].reduce((a,c) => (a[c] = a[c]+1||1)&&a,{});
  let min = template.length;
  let max = 0;
  Object.keys(count).map(e=>(max<count[e])?max = count[e]:1&&(count[e]<min)?min=count[e]:1);
  console.log(max-min);
});
