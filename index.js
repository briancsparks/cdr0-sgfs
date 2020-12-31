
const sg                      = require('./polyrepo/cdr0-sg');
const the                     = require('./polyrepo/cdr0-the');

const { File }                = require('./lib/file');
const { Dir }                 = require('./lib/dir');

module.exports = sg.extend(
    require('./lib/walk')
);

module.exports.fs = the('sgfs_Filesystem', () => {
  return new Filesystem();
})();

function Filesystem() {
  let self = this;

  self.Dir    = Dir;
  self.File   = File;

  self.dirs   = {};
  self.files  = {};
  self.cache  = {};

  self.dir = function(path) {

    // Do we already have it?
    if (self.dirs[path]) {
      return self.dirs[path];
    }

    // No, must make a new one
    const result = new Dir(self, path);
    self.dirs[result.path] = result;

    return result;
  };

  self.file = function(path) {

    // Do we already have it?
    if (self.files[path]) {
      return self.files[path];
    }

    // No, must make a new one
    const result = new File(self, path);
    self.files[result.path] = result;

    return result;
  };
}
