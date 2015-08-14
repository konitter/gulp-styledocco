var createStyleDoccoStream = require('./lib/styledocco').createStyleDoccoStream;

module.exports = function styledocco(options) {
  'use strict';
  return createStyleDoccoStream(options);
};
