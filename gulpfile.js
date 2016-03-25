/*
 * gulpfile.js
 *
 */

// Load plugins
var gulp = require('gulp'),
  htmlhint = require('gulp-htmlhint'),
  scsslint = require('gulp-scss-lint'),
  jshint = require('gulp-jshint'),
  jshintXMLReporter = require('gulp-jshint-xml-file-reporter'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  del = require('del');

//html hint
gulp.task('html-hint', function() {
  return gulp.src('*.html')
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'html hint task complete' }));
});

// scss lint
gulp.task('scss-lint', function() {
  return gulp.src('assets/stylesheet/**/*.scss')
    .pipe(scsslint({
      'reporterOutputFormat': 'Checkstyle',
      'filePipeOutput': 'scss-report.xml'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'scss lint task complete' }));
});

// js hint
gulp.task('js-hint', function () {
  return gulp.src('assets/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(jshintXMLReporter))
    .on('end', jshintXMLReporter.writeFile({
        format: 'checkstyle',
        filePath: 'dist/js-report.xml',
        alwaysReport: 'true'
    }))
    .pipe(notify({ message: 'js hint task complete' }));
});

// Stylesheet
gulp.task('stylesheet', function() {
  return sass('assets/stylesheet/**/*.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    //.pipe(gulp.dest('dist/stylesheet'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/stylesheet'))
    .pipe(notify({ message: 'stylesheet task complete' }));
});

// JavaScript
gulp.task('javascript', function() {
  return gulp.src('assets/javascript/**/*.js')
    .pipe(concat('main.js'))
    //.pipe(gulp.dest('dist/javascript'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/javascript'))
    .pipe(notify({ message: 'javascript task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('assets/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/stylesheet', 'dist/javascript', 'dist/images']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('html-hint', 'scss-lint', 'js-hint', 'stylesheet', 'javascript', 'images');
});

// Watch
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('assets/stylesheet/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('assets/javascript/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('assets/images/**/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);
});