var gulp = require('gulp'),
autoprefixer = require('gulp-autoprefixer'),
batch = require('gulp-batch'),
minifycss = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
clean = require('gulp-clean'),
concat = require('gulp-concat');
babel = require('gulp-babel');
sourcemaps = require('gulp-sourcemaps');
webpack = require('webpack')
gutil = require('gulp-util');
browserSync = require('browser-sync').create();
YAML = require('yamljs');
config = YAML.load('config.yml');
sass = require('gulp-sass');

gulp.task('clean', function() {
  return gulp.src(['public/js', 'public/css'], {read: false})
  .pipe(clean());
});

gulp.task('scripts', function(callback) {
  return webpack({
    entry: {
      app: ['./src/js/app.js']
    },
    output: {
      path: './public/js',
      publicPath: '/js',
      filename: 'all.js'
    },
    module: {
      loaders: [
      {
        test: /\.js$/,
        loaders: ['jsx', 'babel'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css!sass'
      }
      ]
    }
  }, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    // gutil.log("[webpack]", stats.toString({
    //         // output options
    //       }));
  callback();
})});

gulp.task('css', function() {
  return gulp.src('src/css/**/*')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(concat('app.css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('public/css/'))
  .pipe(browserSync.stream())
});

gulp.task('assets', function() {
  gulp.src('src/assets/**/*')
  .pipe(gulp.dest('public/'))
})
gulp.task('default', ['clean'], function() {
  gulp.start(['scripts', 'css', 'assets']);
});

gulp.task('dev', ['clean'], function() {
  gulp.start(['scripts', 'css', 'assets', 'watch']);
});

gulp.task('js-watch', ['scripts'], function() {browserSync.reload()});
gulp.task('watch', function () {
  var port = config['server']['port']||3000;
  console.log('Watching file changes...');
  browserSync.init({
    port: (port+1),
    ui: {port: port+2},
    proxy: 'localhost:' + (port)
  });
  gulp.watch('src/js/**/*.js', ['js-watch']);
  gulp.watch('src/css/**/*', ['css']);
  gulp.watch('src/assets/**/*', ['assets']);
});