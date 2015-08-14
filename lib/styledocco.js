var execFile = require('child_process').execFile;
var gutil    = require('gulp-util');
var lodash   = require('lodash');
var highland = require('highland');
var through2 = require('through2');
var duplexify = require('duplexify');


function createOptArgsByOpts (options) {
  'use strict';

  options = options || {};

  var args = [];

  // The the out dir ommited, StyleDocco use './out' dir.
  if (options.out) args.push('--out', options.out);

  // When the name omitted, StyleDocco try to read a name field in your
  // package.json. And when it failed, StyleDocco use an empty string.
  if (options.name) args.push('--name', options.name);

  if (options.preprocessor) args.push('--preprocessor', options.preprocessor);
  if (options.verbose) args.push('--verbose');
  if (options['no-minify']) args.push('--no-minify');
  if (options.include) {
    options.include.forEach(function (value) {
      args.push('--include', value);
    });
  }

  return args;
}


function createStyleDoccoStream (options, executor) {
  'use strict';

  // Inversion of Control pattern. You can mock the executor.
  executor = executor || execFile;

  var execStyleDocco = through2.obj(function (vinylFiles, encoding, callback) {
    if (vinylFiles.length === 0) {
      callback();
      return;
    }

    var self = this;
    var bin = 'styledocco';
    var optArgs = createOptArgsByOpts(options);

    // It can take files and directories.
    // When a file arrive, StyleDocco use the base path of the file.
    // When a directory arrive, StyleDocco use the path of the directory.
    // When multiple files and directories arrive, StyleDocco use the common
    // path prefix of input files.
    var files = lodash.pluck(vinylFiles, 'path');
    var args = optArgs.concat(files);

    executor(bin, args, function (error, stdout, stderr) {
      if (error) {
        callback(error);
        return;
      }
      if (stderr) gutil.log(stderr);
      if (stdout) gutil.log(stdout.trim());
      callback();
    });
  });

  // Stream to collect all vinyl file instances.
  var collector = highland().collect();
  collector.pipe(execStyleDocco);

  // End the StyleDocco stream when the collector stream is ended.
  return duplexify.obj(collector, execStyleDocco);
}


module.exports = {
  createOptArgsByOpts: createOptArgsByOpts,
  createStyleDoccoStream: createStyleDoccoStream
};
