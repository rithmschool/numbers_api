"use strict";

const path = require("path");
const fs = jest.genMockFromModule("fs");

/**
 * In-memory store for our mock directories and their files
 */
let mockFiles = Object.create(null);

/**
 * Creates our in-memory object with the directories and associated files
 * @param {Object} newMockFiles
 */
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null); // set to null
  for (let file in newMockFiles) {
    const dir = path.dirname(file);
    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
  console.log("mockfiles: ", mockFiles);
}

/**
 * Monkey-patching the built-in fs.readdirSync method
 * @param {String} directoryPath
 */
function readdirSync(directoryPath) {
  try {
    return mockFiles[directoryPath] || [];
  } catch (e) {
    console.error(`Error reading directory ${directoryPath}: `, e.message);
  }
}

/**
 * In-memory object of directors and the content associated with each file
 */
let mockFileContent = Object.create(null);

/**
 * adding a method onto our fs.module
 * @param {Object} newMockFiles
 */
function __setMockFileContent(newMockFiles) {
  mockFileContent = Object.create(null);
  for (let file in newMockFiles) {
    if (!mockFileContent[file]) {
      mockFileContent[file] = [];
    }
    mockFileContent[file].push(newMockFiles[file]);
  }
}

/**
 * monkey-patching fs readFileSync method
 * @param {String} directoryPath
 * @param {string} file
 */
function readFileSync(directoryPath, file) {
  return mockFiles[directoryPath + file] || {};
}

fs.__setMockFiles = __setMockFiles;
fs.__setMockFileContent = __setMockFileContent;
fs.readdirSync = readdirSync;
fs.readFileSync = readFileSync;

module.exports = fs;
