
// Choose one, and comment-out the other.
// const polyrepoLib = './get-local-polyrepo';     // Use this when changing polyrepo, itself
const polyrepoLib = '@cdr0/polyrepo';           // Use this normally (the version in npm works for your needs)

// Build the prequire (poly-require) function
const polyrepoRequire   = require(polyrepoLib)(__dirname);

// The function that will get called, whose results will be the package requested.
const prequire  = function (name) {
  return polyrepoRequire(name) || require(name);
};

module.exports = prequire('@cdr0/the');

