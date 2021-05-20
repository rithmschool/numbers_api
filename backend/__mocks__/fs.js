"use strict";

const path = require("path");
const fs = jest.genMockFromModule("fs");

/**
 * In-memory store for our mock directories and their files
 * This holds a fake 'directory' and the 'files' listed in each directory.
 * Example taken from here: https://jestjs.io/docs/en/manual-mocks
 */
let mockFiles = {};

/**
 * Creates our in-memory object with the directories and their associated files
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
 * This funciton modifies the behaviour of the fs readdirSync method.
 * It returns an array of files associated with a given pathname.
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
 * In-memory object of directories and the content associated with each file
 */
let mockFileContent = {};

/**
 * This method creates an in-memory store of the data associated with each file in a directory.
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
 * This method modifies fs' readFileSync and returns custom data
 * @param {String} directoryPath
 * @param {String} file
 */
function readFileSync(pathname, encoding) {
  try {
    // Checking if it's a "manual" file or a "norm" file.
    if (pathname.includes("norm/good"))
      return JSON.stringify(mockFileContent["/path/to/norm/good/file1.txt"][0]);
    if (pathname.includes("norm/bad"))
      return JSON.stringify(mockFileContent["/path/to/norm/bad/file2.txt"][0]);
    if (pathname.includes("/path/to/manual/"))
      return mockFileContent["/path/to/manual/file2.txt"][0];
  } catch (e) {
    console.error(`Error reading file ${pathname}: `, e.message);
  }
}

fs.__setMockFiles = __setMockFiles;
fs.__setMockFileContent = __setMockFileContent;
fs.readdirSync = readdirSync;
fs.readFileSync = readFileSync;

module.exports = fs;
