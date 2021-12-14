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
  let firstL = template[0];
  let lastL = template[template.length-1];
  let pairFreq = [];
  for(let c=0; c<template.length-1;c++) {
    pairFreq[template.substr(c,2)] = pairFreq[template.substr(c,2)]+1||1;
  }
  for(let step=0;step<40;step++) {
    let keys = Object.keys(pairFreq);
    let newPF = [];
    for(let i=0;i<keys.length;i++) {
      let f = keys[i][0] + inst[keys[i]];
      let l = inst[keys[i]] + keys[i][1];
      newPF[f] = (newPF[f] + pairFreq[keys[i]])||pairFreq[keys[i]];
      newPF[l] = (newPF[l] + pairFreq[keys[i]])||pairFreq[keys[i]];
    }
    pairFreq = newPF;
  }
  // new count lets
  let keys = Object.keys(pairFreq);
  let lets = [];
  for(let i=0;i<keys.length;i++) {
    lets[keys[i][0]] = lets[keys[i][0]]+pairFreq[keys[i]]||pairFreq[keys[i]];
    lets[keys[i][1]] = lets[keys[i][1]]+pairFreq[keys[i]]||pairFreq[keys[i]];
  }
  lets[firstL]++;
  lets[lastL]++;
  let min = lets[firstL];
  let max = 0;
  keys = Object.keys(lets);
  for(let i=0;i<keys.length;i++) {
    let t = lets[keys[i]]/2;
    if(t<min) {
      min = t;
    }
    if(max<t) {
      max = t;
    }
  }
  console.log(max-min);
});
