
const the                     = require('../polyrepo/cdr0-the');
// const sgfs                    = require('..').fs;
// const { File }                = require('./file');
// const { Dir }                 = require('./dir');
// const theFs                   = sgfs.fs;

const theFs = the('sgfs_Filesystem');

module.exports.makeDir = function (dirname) {
  if (typeof dirname === 'string') {
    return theFs().dir(dirname);
  }

  if ('dir' in dirname && typeof dirname.dir === 'function') {
    return dirname.dir();
  }

  return theFs().dir(process.cwd());
};

