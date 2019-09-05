#!/usr/bin/env node
const process = require('process');
const path = require('path');
const mdLinks = require('./md-links').mdLinks;

const enterCommand = []; //Save the enter text on the command line
//Read and push the command line from the terminal
process.argv.forEach((val, index) => {
  enterCommand.push(process.argv[index]);
})

//Var to path and options according to its positions in the command line
let route = process.argv[2]; //path
let firstOption = process.argv[3]; //'validate' or 'stats' option
let secondOption = process.argv[4]; // 'stats' or 'validate' option

//Options
let options = {
  validate: false,
  stats: false
}

//If user enter 'validate' option this change to true
if (firstOption === '--validate' || secondOption === '--validate' || firstOption === '--v' || secondOption === '--v') {
  options.validate = true;
  console.log('VALIDATE',options.validate);
} 
//If user enter 'stats' option this change to true
if (firstOption === '--stats' || secondOption === '--stats' || firstOption === '--s' || secondOption === '--s') {
  options.stats = true; 
  console.log('STATS',options.stats);
}

//Absolute path (or route)
if (path.isAbsolute(route)) {
  return mdLinks(route, options);
} else { //Transform from relative path to absolute path
  route = path.normalize(route);
  route = path.resolve(route);
  return mdLinks(route, options);
}