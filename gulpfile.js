var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

var env = process.env.ENV || 'local';

var configFile = './src/env/' + env + ".js";

var vendorJS = [
  'vendor/jquery/dist/jquery.min.js',
  'vendor/angular/angular.min.js',
  'vendor/angular-cookies/angular-cookies.min.js',
  'vendor/angular-ui-router/release/angular-ui-router.min.js',
  'vendor/moment/min/moment.min.js',
  'vendor/moment/min/locales.min.js',
  'vendor/bootstrap/dist/js/bootstrap.min.js',
  'vendor/alertifyjs/dist/js/ngAlertify.js'
];

var vendorCSS = [
  'vendor/bootstrap/dist/css/bootstrap.min.css',
  'vendor/alertifyjs/dist/css/alertify.css'
];

gulp.task('vendorJS', function () {
  return gulp.src(vendorJS)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./public/vendor/js'))
});

gulp.task('vendorCSS', function () {
  return gulp.src(vendorCSS)
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('./public/vendor/css'))
});

gulp.task('bootstrapFonts', function () {
  return gulp.src(['vendor/bootstrap/dist/fonts/**/*.*'])
    .pipe(gulp.dest('./public/vendor/fonts'))
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


gulp.task('vendor', ['vendorJS', 'vendorCSS', 'bootstrapFonts']);

gulp.task('build', ['vendor', 'copy', 'copyApp', 'copyAssets']);

gulp.task('default', ['browser-sync'], function () {
  gulp.watch('./src/**/*.*', ['build']);
  gulp.watch('./public/**/*.*').on('change', browserSync.reload);
});