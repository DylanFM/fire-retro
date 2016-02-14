var gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    filter       = require('gulp-filter'),
    usemin       = require('gulp-usemin'),
    minifyCSS    = require('gulp-minify-css'),
    htmlmin      = require('gulp-htmlmin'),
    source       = require('vinyl-source-stream'),
    streamify    = require('gulp-streamify'),
    browserify   = require('browserify'),
    exorcist     = require('exorcist'),
    jshint       = require('gulp-jshint'),
    autoprefixer = require('gulp-autoprefixer'),
    gzip         = require('gulp-gzip'),
    browserSync  = require('browser-sync').create();

gulp.task('serve', function() {
  browserSync.init({
    server: "./dist"
  });
});

gulp.task('sass', function() {
  return sass('src/styles/', { sourcemap: false })
    // .pipe(sourcemaps.write('dist/styles', {
    //   includeContent: false
    // }))
    //.pipe(gzip())
    .pipe(autoprefixer({
      browsers:  ['last 2 versions'],
      cascade:   false
    }))
    .pipe(filter('**/*.css'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('htmlmin', function() {
  gulp.src('src/*.html')
    .pipe(usemin({
      css: [minifyCSS(), 'concat']
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/'));
});

// Browserify and babel
gulp.task('buildScripts', function() {
  browserify({ debug: true })
    .transform("babelify", { presets: ["es2015"] })
    .require('./src/scripts/main.js', { entry: true })
    .bundle()
    .on('error', function (err) { console.log(err.message); })
    .pipe(exorcist('dist/scripts/main.map'))
    .pipe(source('main.js'))
    // .pipe(gzip())
    .pipe(gulp.dest('dist/scripts/'))
});

gulp.task('lint', function() {
  gulp.src('src/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
  // Reload browser when built assets change
  gulp.watch(['*.html', 'scripts/**/*.js'], { cwd: 'dist' }, browserSync.reload);
  // Build sass files on change
  gulp.watch(['styles/**/*.scss'], { cwd: 'src' }, ['sass']);
  // Lint and process JS files on change
  gulp.watch(['scripts/**/*.js'], { cwd: 'src' }, ['lint', 'buildScripts']);
  // Minify HTML files on change
  gulp.watch(['*.html'], { cwd: 'src' }, ['htmlmin']);
});

gulp.task('default', ['sass', 'buildScripts', 'htmlmin', 'serve', 'watch']);
