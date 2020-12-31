
const fs                      = require('fs');
const path                    = require('path');
const util                    = require('util');
const { addEntryFns }         = require('./entry');
const sg                      = require('../polyrepo/cdr0-sg');

module.exports.Dir = function(filesystem, path_) {
  let self = this;
  self.path = path_ || process.cwd();

  self.pathname = function() {
    return self.path;
  };

  // So user can set a convienent name
  self.setName = function(name) {
    filesystem.cache[name] = self;
  };

  self.cd = self.dir = function(...relativePaths) {
    if (relativePaths.length === 0) {
      return this;
    }

    const newPath = path.join(self.path, ...relativePaths);
    return filesystem.dir(newPath);
  };

  self.parent = function() {
    const parentDir   = path.dirname(self.path);
    return filesystem.dir(parentDir);
  };

  self.file = function(...relativePaths) {
    const newPath = path.join(self.path, ...relativePaths);
    return filesystem.file(newPath);
  };

  // ---
  self.async = {};

  self.writeFileSync = function(filename, ...args) {
    const pathname = path.join(self.path, ...sg.arrayify(filename));
    const err      = fs.writeFileSync(pathname, ...args);
    if (err) {
      return err;
    }

    return filesystem.file(pathname);
  };

  self.writeFile = function (filename, ...args_) {
    let [args, callback] = sg.splitLastCb(args_);

    const pathname = path.join(self.path, ...sg.arrayify(filename));
    return fs.writeFile(pathname, ...args, (err) => {
      if (err) {
        return callback(err);
      }

      return callback(null, filesystem.file(pathname));
    });
  };

  self.async.writeFile = util.promisify(self.writeFile);

  addEntryFns(self, filesystem, path);
};
