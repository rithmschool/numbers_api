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
    const dir = path.dirname(file) + "/";
    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

/**
 * Monkey-patching the built-in fs.readdirSync method
 * @param {String} directoryPath
 */
function readdirSync(directoryPath) {
  try {
    return mockFiles[directoryPath] || [];
  } catch (e) {
    console.error(`Issue reading from directory ${directoryPath}: `, e.message);
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
  let content = JSON.parse(newMockFiles);
  for (let file in content) {
    if (!mockFileContent[file]) {
      mockFileContent[file] = [];
    }
    mockFileContent[file].push(content[file]);
  }
}

/**
 * monkey-patching fs readFileSync method
 * @param {String} directoryPath
 * @param {string} file
 */
function readFileSync(pathname, encoding) {
  try {
    // Checking if it's a "manual" file or a "norm" file.
    if (Array.isArray(mockFileContent[pathname][0])) {
      return mockFileContent[pathname][0][0];
    }
    return JSON.stringify(mockFileContent[pathname][0]) || {};
  } catch (e) {
    console.error(`Error reading file ${pathname}: `, e.message);
  }
}

fs.__setMockFiles = __setMockFiles;
fs.__setMockFileContent = __setMockFileContent;
fs.readdirSync = readdirSync;
fs.readFileSync = readFileSync;

module.exports = fs;
