var gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    htmlmin      = require('gulp-htmlmin'),
    to5ify       = require('6to5ify'),
    source       = require('vinyl-source-stream'),
    streamify    = require('gulp-streamify'),
    browserify   = require('browserify'),
    jshint       = require('gulp-jshint'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload;

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('sass', function() {
  gulp.src('src/styles/**/*.scss')
    .pipe(sass({
      style: 'expanded'
    }))
    .pipe(autoprefixer({
      browsers:  ['last 2 versions'],
      cascade:   false
    }))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('htmlmin', function() {
  gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(reload({
      stream: true
    }));
});

// Browserify and 6to5
gulp.task('buildScripts', function() {
  browserify({ debug: true })
    .transform(to5ify.configure())
    .require('./src/scripts/main.js', { entry: true })
    .bundle()
    .on('error', function (err) { console.log('Error: ' + err.message); })
    .pipe(source('main.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('lint', function() {
  gulp.src('src/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
  // Reload browser when built assets change
  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], { cwd: 'dist' }, reload);
  // Build sass files on change
  gulp.watch(['styles/**/*.scss'], { cwd: 'src' }, ['sass']);
  // Lint and process JS files on change
  gulp.watch(['scripts/**/*.js'], { cwd: 'src' }, ['lint', 'buildScripts']);
  // Minify HTML files on change
  gulp.watch(['*.html'], { cwd: 'src' }, ['htmlmin']);
});

gulp.task('default', ['watch', 'serve']);
