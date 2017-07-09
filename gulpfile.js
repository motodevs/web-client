var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

var env = process.env.ENV || 'local';

var configFile = './src/env/' + env + ".js";

var vendorJS = [
  'vendor/angular/angular.min.js',
  'vendor/angular-cookies/angular-cookies.min.js',
  'vendor/angular-ui-router/release/angular-ui-router.min.js',
  'vendor/jquery/jquery.min.js',
  'vendor/moment/min/moment.min.js',
  'vendor/moment/min/locales.min.js'
];


gulp.task('vendor', function () {
  return gulp.src(vendorJS)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./public/vendor'))
});

gulp.task('copy', function () {
  return gulp.src(['!./src/app/app.js', './src/app/**/*.*', './src/index.html'])
    .pipe(gulp.dest('./public'));

});

gulp.task('copyAssets', function () {
  return gulp.src(['./src/assets/**/*.*'])
    .pipe(gulp.dest('./public'));

});


gulp.task('copyApp', function () {
  return gulp.src(['./src/app/app.js', configFile])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/'));
});


gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './public'
    },
    browser: 'Chrome'
  });
});


gulp.task('build', ['vendor', 'copy', 'copyApp', 'copyAssets']);

gulp.task('default', ['browser-sync'], function () {
  gulp.watch('./src/**/*.*', ['build']);
  gulp.watch('./public/**/*.*').on('change', browserSync.reload);
});