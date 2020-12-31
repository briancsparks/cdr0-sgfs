
const fs                      = require('fs');
const path                    = require('path');
const util                    = require('util');


module.exports.addEntryFns = function(self, filesystem, path) {
  self.entryNameStr = function(itemName) {
    if (!itemName) {
      return self.pathname();
    }

    const dir = self.dir();
    return dir && path.join(self.pathname(), itemName);
  };

  self.statSync = function(itemName) {
    const entryName = self.entryNameStr(itemName);
    const stats     = fs.statSync(entryName);

    return stats;
  };

  self.stat = function(itemName, callback) {
    const entryName = self.entryNameStr(itemName);
    return fs.stat(entryName, callback);
  };

  self.async.stat = util.promisify(self.stat);

  addFsStatsFn('isDirectory');
  addFsStatsFn('isFile');

  function addFsStatsFn(fnName) {
    self[`${fnName}Sync`] = function(itemName) {
      const stats = self.statSync(itemName);
      return stats[fnName]();
    };

    self[fnName] = function(itemName, callback) {
      if (arguments.length === 1) {
        return self[fnName](null, callback);
      }

      return self.stat(itemName, (err, stats) => {
        if (err) { return callback(err); }

        return callback(null, stats[fnName]());
      });
    };

    self.async[fnName] = util.promisify(self[fnName]);
  }
};


