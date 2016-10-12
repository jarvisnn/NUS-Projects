var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    batch = require('gulp-batch'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    concat = require('gulp-concat');

gulp.task('clean', function() {
  del(['build/*']);
});

gulp.task('scripts', function() {
  return gulp.src([
      'public/javascripts/**/*.js'
    ])
    .pipe(concat('concat.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/build/javascripts'));
});

gulp.task('css', function() {
  return gulp.src('public/stylesheets/**/*.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/build/stylesheets'))
});

gulp.task('build', function() {
  gulp.start(['scripts', 'css']);
});

gulp.task('default', ['clean'], function() {
  gulp.start(['build', 'watch']);
});

gulp.task('watch', function () {
  console.log("Watching file changes...");

  gulp.watch('public/javascripts/**/*.js', batch(function (events, done) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.start('scripts', done);
  }));

  gulp.watch('public/stylesheets/**/*.css', batch(function (events, done) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.start('css', done);
  }));
});