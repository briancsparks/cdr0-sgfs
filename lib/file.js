
const fs                      = require('fs');
const path                    = require('path');
const util                    = require('util');
const sg                      = require('../polyrepo/cdr0-sg');
const { addEntryFns }         = require('./entry');

module.exports.File = function(filesystem, path) {
  let self = this;
  self.path = path;

  self.pathname = function() {
    return self.path;
  };

  // So user can set a convienent name
  self.setName = function(name) {
    filesystem.cache[name] = self;
  };

  self.dir = function() {
    const newPath = path.dirname(self.path);
    return filesystem.dir(newPath);
  };

  self.parent = function() {
    const myDir       = path.dirname(self.path);
    const parentDir   = path.dirname(myDir);
    return filesystem.dir(parentDir);
  };

  // ---
  self.async = {};

  // ------------------------------------------------------------------------------------------------------------------
  // write file

  self.writeFileSync = function(...args) {
    const err      = fs.writeFileSync(self.path, ...args);
    if (err) {
      return err;
    }

    return this;
  };

  self.writeFile = function (...args_) {
    let [args, callback] = sg.splitLastCb(args_);

    return fs.writeFile(self.path, ...args, (err) => {
      if (err) {
        return callback(err);
      }

      return callback(null, this);
    });
  };

  self.async.writeFile = util.promisify(self.writeFile);

  // ------------------------------------------------------------------------------------------------------------------
  // read file

  self.readFileSync = function(...args) {
    return fs.readFileSync(self.path, ...args);
  };

  self.readFile = function (...args) {
    return fs.readFile(self.path, ...args);
  };

  self.async.readFile = util.promisify(self.readFile);

  // ------------------------------------------------------------------------------------------------------------------
  // include (require)

  self.include = function() {
    try {
      return require(self.path);
    } catch(e) {
      console.error(`Error trying to include ${self.path}`);
    }
  };

  addEntryFns(self, filesystem, path);
};
