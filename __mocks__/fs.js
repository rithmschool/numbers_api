"use strict";

const path = require("path");
const fs = jest.genMockFromModule("fs");

/**
 * In-memory store for our mock directories and their files
 */
let mockFiles = {};

/**
 * Creates our in-memory object with the directories and associated files
 * @param {Object} newMockFiles
 */
function __setMockFiles(newMockFiles) {
  mockFiles = {};
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
  console.log("DIRECTROY: ", directoryPath);
  try {
    return mockFiles[directoryPath] || [];
  } catch (e) {
    console.error(`Issue reading from directory ${directoryPath}: `, e.message);
  }
}

/**
 * In-memory object of directories and the content associated with each file
 */
let mockFileContent = {};

/**
 * adding a method onto our fs.module
 * @param {Object} newMockFiles
 */
function __setMockFileContent(newMockFiles) {
  mockFileContent = {};
  let content = JSON.parse(newMockFiles);
  for (let file in content) {
    let fileContent = content[file];
    if (!mockFileContent[file]) {
      mockFileContent[file] = [];
    }
    mockFileContent[file].push(fileContent);
  }
}

/**
 * Monkey-patching fs readFileSync method.
 * This method is used for testing purposes to return specific data in place of text files for 'models/data.js'
 * @param {String} directoryPath
 * @param {string} file
 */
function readFileSync(pathname, encoding) {
  try {
    // Checking if it's a "manual" file or a "norm" file.
    if (pathname.includes("norm/good"))
      return JSON.stringify(mockFileContent["/path/to/norm/good/file1.txt"][0]);
    if (pathname.includes("norm/bad"))
      return JSON.stringify(mockFileContent["/path/to/norm/bad/file2.txt"][0]);
    if (pathname.includes("/path/to/manual/"))
      return JSON.stringify(mockFileContent["/path/to/manual/file2.txt"][0]);
  } catch (e) {
    console.error(`Error reading file ${pathname}: `, e.message);
  }
}

fs.__setMockFiles = __setMockFiles;
fs.__setMockFileContent = __setMockFileContent;
fs.readdirSync = readdirSync;
fs.readFileSync = readFileSync;

module.exports = fs;
