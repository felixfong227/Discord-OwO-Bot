#!/usr/bin/env node

const JSON5 = require('json5');
const fs = require('fs');

const inputFile = process.argv[2];
let outputFile = process.argv[3];

if(outputFile === "self") outputFile = inputFile;

if(!inputFile && !outputFile) {
    console.error('Missing either input or output path as CLI argument');
    return process.exit(1);
}

const inputFileContent = fs.readFileSync(inputFile, 'utf8')

if(inputFileContent) {
    const parsedContent = JSON5.parse(inputFileContent);
    const jsonString = JSON.stringify(parsedContent, null, 4);
    fs.writeFileSync(
        outputFile,
        jsonString
    );
}