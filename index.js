var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var through     = require('through2');
var defaults    = require('lodash.defaults');
var exec        = require('child_process').exec;

var PLUGIN_NAME = 'gulp-styledocco';

module.exports = function (options) {
  'use strict';

  var firstFile = null;
  var opts = defaults(options || {}, {
    out: 'docs',
    name: 'Styledocco',
    include: null,
    preprocessor: null
  });
  var count = 0;

  function transform (file, encoding, cb) {

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    count++;

    if (!firstFile) {
      firstFile = file;
    }

    cb();
  }

  function flush (cb) {

    var bin = 'styledocco ';
    var args = [];

    args.push('--out', opts.out);
    if (opts.name !== null) {
      args.push('--name', '"' + opts.name + '"');
    }
    if (opts.preprocessor !== null) {
      args.push('--preprocessor', opts.preprocessor);
    }
    if (opts.include !== null) {
      opts.include.forEach(function (value) {
        return args.push('--include', value);
      });
    }
    if (opts.verbose) {
      args.push('--verbose', opts.verbose);
    }
    if (opts['no-minify']) {
      args.push('--no-minify');
    }

    if (count > 1) {
      args.push(firstFile.base);
    } else {
      args.push(firstFile.path);
    }

    exec(bin + args.join(' '), function (error, stdout, stderr) {
      if (stderr) {
        gutil.log(stderr);
      }
      if (stdout) {
        stdout = stdout.trim();
        gutil.log(stdout);
      }
      cb(error);
    });

  }

  return through.obj(transform, flush);
};
