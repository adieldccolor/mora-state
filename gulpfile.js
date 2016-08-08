var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var copy = require('gulp-copy');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var babel = require('gulp-babel');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglifyjs');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

var isProduction = false;
var folder_root = '';

gulp.task('dist-bower-css', function() {
	console.log("Bundling bower_components stylesheets");
  return gulp.src(mainBowerFiles({
        "overrides": {
          "bootstrap": {
               "main": "dist/css/bootstrap.css"
          },
          "BigVideo": {
               "main": "css/bigvideo.css"
          },
          "wow": {
               "main": "css/libs/animate.css"
          }
        }
      }))
      .pipe(filter('**/*.css'))
      .pipe(gulpIf(!isProduction, sourcemaps.init()))
      .pipe(concat('vendor.css'))
      .pipe(gulpIf(isProduction, cleanCSS()))
      .pipe(gulpIf(!isProduction, sourcemaps.write()))
      .pipe(gulp.dest(folder_root + 'assets/css'));;
});

gulp.task('dist-bower-js', function() {
	console.log("Bundling bower_components scripts");
  console.log("Production? " + isProduction);
  return gulp.src(mainBowerFiles({
        "overrides": {
          "bootstrap": {
           "main": "dist/js/bootstrap.js"
          },
          "modernizer": {
            "main": 'modernizr.js'
          },
          "outlayer": {
            "main": [
              "item.js",
              "outlayer.js"
            ]
          },
          "isotope": {
            "main": "dist/isotope.pkgd.js"
          },
          "packery": {
            "main": "dist/packery.pkgd.js"
          },
          "isotope-packery": {
            "main": "packery-mode.pkgd.js"
          },
          "headroom.js": {
            "main": "dist/headroom.js"
          },
          "videojs-vimeo": {
            "main": "src/Vimeo.js"
          }
        }
      }))
      .pipe(filter('**/*.js'))
      .pipe(gulpIf(!isProduction, sourcemaps.init()))
      .pipe(concat('vendor.js', {sourcesContent: true}))
      .pipe(gulpIf(isProduction, uglify()))
      .pipe(gulpIf(!isProduction, sourcemaps.write()))
      .pipe(gulp.dest(folder_root + 'assets/js'));
});


gulp.task('dist-app-styles', function () {
	console.log("Bundling app stylesheets");
  gulp.src('./src/styles/main.scss')
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(isProduction, cleanCSS()))
    .pipe(gulpIf(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest(folder_root + 'assets/css'));
});

gulp.task('dist-app-js', function() {
	console.log("Bundling app scripts");
  return gulp.src('src/scripts/*.js')
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(concat('main.js', {sourcesContent: true}))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulpIf(isProduction, uglify()))
    .pipe(gulpIf(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest(folder_root + 'assets/js'));
});

gulp.task('dist-copy-fonts', function() {
  console.log("Copying fonts");
  return gulp.src('src/fonts/*')
    .pipe(copy('assets/', { prefix: 1 }));
});

gulp.task('dist-set-production', function() {
  console.log("Bundling for Production");
  isProduction = true;
  return isProduction;
});

gulp.task('dist-set-wordpress', function() {
  console.log("Bundling for Wordpress");
  folder_root = '../../morastate/wp-content/themes/mora-state/';
  console.log('Send files to: ' + folder_root + 'assets/');
  return folder_root;
});

gulp.task('default', ['dist-bower-css', 'dist-bower-js', 'dist-app-styles', 'dist-app-js']);
gulp.task('production', ['dist-set-production', 'dist-bower-css', 'dist-bower-js', 'dist-app-styles', 'dist-app-js']);
gulp.task('wordpress', ['dist-set-wordpress', 'dist-set-production', 'dist-bower-css', 'dist-bower-js', 'dist-app-styles', 'dist-app-js']);
gulp.task('wordpress-dev', ['dist-set-wordpress', 'dist-bower-css', 'dist-bower-js', 'dist-app-styles', 'dist-app-js']);