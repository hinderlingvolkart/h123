var gulp = require('gulp'),
    gulpFilter = require('gulp-filter'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    fs = require('fs');

// Files to aggregate
var files = [
  './templates/*.tpl',
  './stylesheets/*.scss',
  './stylesheets/*.css',
  './src/*.js'
];


function getBookmarklet() {
  var script = fs.readFileSync('docs/bookmarklet.js', 'utf8');
  return 'javascript:(function(){' + encodeURIComponent(script) + '}())';
}

function prepareJSVariable(str) {
  str = str.replace(/\s+/g, ' ');
  str = str.replace(/'/g, '\\\'');
  return str;
}

gulp.task('readme', ['compile'], function() {
  return gulp.src('src/readme.html')
    .pipe(replace('{{bookmarklet}}', getBookmarklet()))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('docs'))
});



// Build

gulp.task('compile', function(cb) {
  var postcss = require('postcss');
  var autoprefixer = require('autoprefixer');

  var html = fs.readFileSync('src/bookmarklet.ui.html', 'utf8');
  var css = fs.readFileSync('src/bookmarklet.ui.css', 'utf8');

  postcss([autoprefixer])
    .process(css)
    .then(function(cssResult) {
      html = html.replace('{{css}}', cssResult.css);
      var stream = gulp.src('src/*.js')
        .pipe(replace('{{ui}}', prepareJSVariable(html)))
        .pipe(gulp.dest('./docs'))
        .pipe(uglify())
        .pipe(gulp.dest('./docs'))
        .on('end', cb);
    });
});

gulp.task('build', ['compile', 'readme']);


// Macro tasks
gulp.task('work', ['build']);
gulp.task('default', ['build']);
