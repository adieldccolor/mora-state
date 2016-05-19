var gulp = require('gulp');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');

gulp.task('dist-bower-css', function() {
	console.log("Bundling bower_components stylesheets");
  return gulp.src(mainBowerFiles({
        "overrides": {
          "bootstrap": {
               "main": "dist/css/bootstrap.css"
          }
        }
      }))
      .pipe(filter('**/*.css'))
      .pipe(concatCss('vendor.css'))
      .pipe(gulp.dest('assets/css'));;
});

gulp.task('dist-bower-js', function() {
	console.log("Bundling bower_components scripts");
  return gulp.src(mainBowerFiles({
        "overrides": {
          "bootstrap": {
           "main": "dist/js/bootstrap.js"
          },
          "modernizer": {
            "main": 'modernizr.js'
          }
        }
      }))
      .pipe(filter('**/*.js'))
      .pipe(concat('vendor.js', {sourcesContent: true}))
      .pipe(gulp.dest('assets/js'));
});


gulp.task('dist-app-styles', function () {
	console.log("Bundling app stylesheets");
  gulp.src('./src/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('dist-app-js', function() {
	console.log("Bundling app scripts");
  return gulp.src('src/scripts/*.js')
  	.pipe(concat('main.js', {sourcesContent: true}))
    // .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});

gulp.task('dist-copy-fonts', function() {
	console.log("Copying fonts");
  return gulp.src('src/fonts/*')
  	.pipe(copy('assets/', { prefix: 1 }));
});

gulp.task('default', ['dist-bower-css', 'dist-bower-js', 'dist-app-styles', 'dist-app-js']);