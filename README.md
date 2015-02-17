# gulp-styledocco

[StyleDocco](https://github.com/jacobrask/styledocco) plugin for [gulp](https://github.com/wearefractal/gulp).

> StyleDocco generates documentation and style guide documents from your stylesheets.

This task requires you to have StyleDocco installed globally. Run `npm install -g styledocco` to install it.

**This plugin has NOT been tested thoroughly.**

## Install

```
npm install gulp-styledocco --save-dev
```

## Usage
```javascript
var styledocco = require('gulp-styledocco');

gulp.task('styledocco', function () {
  gulp.src('src/**/*.css')
    .pipe(styledocco({
      out: 'docs',
      name: 'My Project',
      'no-minify': true
    }));
});
```

## Options

### out

Type: `String`
Default value: `docs`

The output directory.

### name

Type: `String`
Default value: `Styledocco`

The name of the project.

### include

Type: `String`
Default value: `null`

Include specified CSS and/or JavaScript files in the previews. (ex: `['mysite.css', 'app.js']`)

### preprocessor

Type: `String`
Default value: `null`

A custom preprocessor command (ex: `'~/bin/lessc'`).

### verbose

Type: `Boolean`
Default value: `false`

Show log messages when generating the documentation.

### no-minify

Type: `Boolean`
Default value: `false`

Do not minify the code.

## License

(MIT License)

Copyright (c) 2014 [konitter](http://re-dzine.net/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
