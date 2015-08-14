var assert = require('assert');


describe('gulp-styledocco', function () {
  it('should export a function', function () {
    var styledocco = require('../');

    assert.strictEqual(typeof styledocco, 'function');
  });


  it('should export a function that return a stream', function () {
    var styledocco = require('../');

    assert.strictEqual(typeof styledocco().pipe, 'function');
  });
});
