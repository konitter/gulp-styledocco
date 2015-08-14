var assert = require('assert');
var sinon = require('sinon');
var styledocco = require('../lib/styledocco');
var highland = require('highland');
var Promise = require('es6-promise').Promise;
var eos = require('end-of-stream');
var exhaust = require('stream-exhaust');


describe('styledocco', function () {
  describe('.createOptArgsByOpts', function () {
    var createOptArgsByOpts = styledocco.createOptArgsByOpts;


    it('should return no options when given no options', function () {
      var args = createOptArgsByOpts();

      assert.deepEqual(args, []);
    });


    it('should return a specified --name option when given the "name" option', function () {
      var args = createOptArgsByOpts({ name: 'STYLEDOCCO_NAME' });

      assert.deepEqual(args, [ '--name', '"STYLEDOCCO_NAME"' ]);
    });


    it('should return a specified --out option when given the "out" option', function () {
      var args = createOptArgsByOpts({ out: 'OUTPUT_DIR' });

      assert.deepEqual(args, [ '--out', 'OUTPUT_DIR' ]);
    });


    it('should return a specified --preprocessor option when given the "preprocessor" option', function () {
      var args = createOptArgsByOpts({ preprocessor: 'PREPROCESSOR' });

      assert.deepEqual(args, [ '--preprocessor', 'PREPROCESSOR' ]);
    });


    it('should return a --verbose option when given the "verbose" option', function () {
      var args = createOptArgsByOpts({ verbose: true });

      assert.deepEqual(args, [ '--verbose' ]);
    });


    it('should return a --no-minify option when given the "no-minify" option', function () {
      var args = createOptArgsByOpts({ 'no-minify': true });

      assert.deepEqual(args, [ '--no-minify' ]);
    });


    it('should return no options when given an empty "include" option', function () {
      var args = createOptArgsByOpts({ include: [] });

      assert.deepEqual(args, []);
    });


    it('should return a specified --include option when given a "include" option has a file', function () {
      var args = createOptArgsByOpts({ include: [ 'INCLUDE_FILE' ] });

      assert.deepEqual(args, [ '--include', 'INCLUDE_FILE' ]);
    });


    it('should return several --include options when given a "include" option has several files', function () {
      var args = createOptArgsByOpts({ include: [ 'INCLUDE_FILE_1', 'INCLUDE_FILE_2' ] });

      assert.deepEqual(args, [
        '--include', 'INCLUDE_FILE_1',
        '--include', 'INCLUDE_FILE_2'
      ]);
    });
  });



  describe('.createStyleDoccoStream', function () {
    var createStyleDoccoStream = styledocco.createStyleDoccoStream;


    it('should do nothing when given a file', function () {
      var execMock = createExecutorMock();

      var gulpSrc = createGulpSrcStream([]);
      var stream = gulpSrc.pipe(createStyleDoccoStream(null, execMock));

      return callWhenStreamEnd(stream, function () {
        sinon.assert.notCalled(execMock);
      });
    });


    it('should exec a styledocco command when given a file', function () {
      var execMock = createExecutorMock();

      var gulpSrc = createGulpSrcStream([
        createVinylFileStub('path/to/file')
      ]);
      var stream = gulpSrc.pipe(createStyleDoccoStream(null, execMock));

      return callWhenStreamEnd(stream, function () {
        sinon.assert.calledOnce(execMock);
        sinon.assert.calledWith(execMock, 'styledocco path/to/file');
      });
    });


    it('should exec a styledocco command when given several file', function () {
      var execMock = createExecutorMock();

      var gulpSrc = createGulpSrcStream([
        createVinylFileStub('path/to/file1'),
        createVinylFileStub('path/to/file2'),
        createVinylFileStub('path/to/file3')
      ]);
      var stream = gulpSrc.pipe(createStyleDoccoStream(null, execMock));

      return callWhenStreamEnd(stream, function () {
        sinon.assert.calledOnce(execMock);
        sinon.assert.calledWith(execMock, 'styledocco path/to/file1 path/to/file2 path/to/file3');
      });
    });


    it('should exec a styledocco command when given an option and several file', function () {
      var execMock = createExecutorMock();

      var gulpSrc = createGulpSrcStream([
        createVinylFileStub('path/to/file')
      ]);
      var options = {
        out: 'path/to/out'
      };
      var stream = gulpSrc.pipe(createStyleDoccoStream(options, execMock));

      return callWhenStreamEnd(stream, function () {
        sinon.assert.calledOnce(execMock);
        sinon.assert.calledWith(execMock, 'styledocco --out path/to/out path/to/file');
      });
    });


    it('should exec a styledocco command when given several options and several file', function () {
      var execMock = createExecutorMock();

      var gulpSrc = createGulpSrcStream([
        createVinylFileStub('path/to/file')
      ]);
      var options = {
        out: 'path/to/out',
        verbose: true
      };
      var stream = gulpSrc.pipe(createStyleDoccoStream(options, execMock));

      return callWhenStreamEnd(stream, function () {
        sinon.assert.calledOnce(execMock);
        sinon.assert.calledWith(execMock, 'styledocco --out path/to/out --verbose path/to/file');
      });
    });
  });
});


function createExecutorMock () {
  var execMock = sinon.mock();

  // 2nd argument of the executor is a callback.
  // It should be called.
  execMock.callsArgAsync(1);

  return execMock;
}


function createVinylFileStub (filepath) {
  // gulp-styledocco care only a path field.
  return { path: filepath };
}


function createGulpSrcStream (vinylFiles) {
  var gulpSrc = highland();

  vinylFiles.forEach(function (vinylFile) {
    gulpSrc.write(vinylFile);
  });
  gulpSrc.end();

  return gulpSrc;
}


function callWhenStreamEnd(stream, fn) {
  // Mocha can take a promise as the test result.
  return new Promise(function (fulfill, reject) {
    // Consume the given stream and register callback the stream end.
    // This code can simulate the Gulp v4 behavior.
    eos(exhaust(stream), function () {
      try {
        fn();
        fulfill();
      }
      catch (e) {
        reject(e);
      }
    });
  });
}
