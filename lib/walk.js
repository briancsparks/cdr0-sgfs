
const utils                   = require('./utils');
const sg                      = require('../polyrepo/cdr0-sg');

// General purpose walk
const walk = module.exports.walk = function(start) {

};

// General purpose walk
const gpwalk_ = module.exports.gpwalk_ = function(start, fn, callback, iterItem) {
  let item      = start;
  let hasError  = false;
  let result    = [];
  let errors    = [];

  setImmediate(doOne);
  function doOne() {
    const nextItem = iterItem(item);
    const next = function(err, value_, stop) {
      if (err) { hasError = true; }
      errors.push(err);

      let value = value_;
      if (value === true)             { value = item; }
      else if (sg.isnt(value))        { value = []; }

      result = [...result, ...sg.arrayify(value)];

      if (stop || !nextItem) {
        return callback(hasError ? errors : null, result);
      }

      item = nextItem;
      return process.nextTick(doOne);
    };

    return fn(item, next);
  }
};

const mkUpIter = module.exports.mkUpIter = module.exports.upIter = function(predicate) {
  return function(item) {
    const parent = item.parent();
    if (item.pathname() === '/' && parent.pathname() === '/') {
      return null;
    }

    return predicate(item, parent);
  };
};

const stopHasDir = module.exports.stopHasDir = function(dirname) {
  return function(item, callback) {
    return item.stat(dirname, (err, stats) => {
      if (err) { return callback(err); }

      return callback(null, stats.isDirectory());
    });
  };
};

module.exports.walkUp = function (start_, fn, callback) {
  const start = utils.makeDir(start_);
};

