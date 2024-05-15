/**
 * Quick script to convert json file into .js object.
 */

import fs from 'fs'

const fileName = "master_ver3"

// Read the JSON file.
const jsonData = fs.readFileSync(`src/data/${fileName}.json`, 'utf8');

// Parse the JSON string into a JavaScript object.
const jsObject = JSON.parse(jsonData);

// Convert the JavaScript object into a string.
const jsObjectString = `export const data = ${JSON.stringify(jsObject, null, 2)};`;

// Write the JavaScript object to a .js file.
fs.writeFileSync(`src/data/${fileName}.js`, jsObjectString);

console.log('Conversion complete');