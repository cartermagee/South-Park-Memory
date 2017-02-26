"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cached = require('gulp-cached');

gulp.task('sass', function() {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./lib/styles/'));
});

gulp.task('js', function() {
  gulp.src('./src/js/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    // .pipe(uglify())
    .pipe(gulp.dest('lib/js/'));

  gulp.src('./src/js/vendor/*.js')
    .pipe(cached('vendor-processing'))
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./lib/js/vendor/'));
});

gulp.task('watch', function() {
  gulp.watch('./src/styles/**/*.scss', ['sass']);
  gulp.watch('./src/js/*.js', ['js']);
});

gulp.task('default', ['watch']);
