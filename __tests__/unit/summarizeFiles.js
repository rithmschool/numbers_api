const fs = require("fs");
const path = require("path");

function summarizeFilesInDirectorySync(directory) {
  return fs.readdirSync(directory).map((file) => {
    directory, file;
  });
}

function summarizeReadFileSync(path, file) {
  return fs.readFileSync(path, file);
}

exports.summarizeFiles = summarizeFilesInDirectorySync;
exports.readFiles = summarizeReadFileSync;
