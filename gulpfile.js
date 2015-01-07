var gulp        = require('gulp')
    browserSync = require('browser-sync');

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('watch', function() {
  // Reload browser when assets change
  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], { cwd: 'dist' }, browserSync.reload);
});

gulp.task('default', ['watch', 'serve']);
