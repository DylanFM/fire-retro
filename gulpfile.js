var gulp        = require('gulp'),
    sass        = require('gulp-ruby-sass'),
    htmlmin     = require('gulp-htmlmin'),
    to5         = require('gulp-6to5'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

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

gulp.task('to5', function() {
  gulp.src('src/scripts/**/*.js')
    .pipe(to5())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('watch', function() {
  // Reload browser when built assets change
  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], { cwd: 'dist' }, reload);
  // Build sass files on change
  gulp.watch(['styles/**/*.scss'], { cwd: 'src' }, ['sass']);
  // Process JS files on change
  gulp.watch(['scripts/**/*.js'], { cwd: 'src' }, ['to5']);
  // Minify HTML files on change
  gulp.watch(['*.html'], { cwd: 'src' }, ['htmlmin']);
});

gulp.task('default', ['watch', 'serve']);
