var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');

var reload = browserSync.reload;

gulp.task('sass', function () {
    return sass('assets/scss/styles.scss')
        .pipe(gulp.dest('dist'))
        .pipe(reload({
            stream: true
        }));
});

// watch Sass files for changes, run the Sass preprocessor with the 'sass' task and reload
gulp.task('serve', ['sass'], function () {
    browserSync({
        server: {
            baseDir: ''
        }
    });

    gulp.watch('assets/scss/*.scss', ['sass']);
    gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], {
        cwd: 'assets'
    }, reload);
});
