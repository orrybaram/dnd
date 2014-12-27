var gulp = require('gulp');
var sass = require('gulp-ruby-sass');


var paths = {
  sass: ['./src/sass/**/*.scss'],
};


gulp.task('default', function() {
  return gulp.src('src/sass/app.scss')
        .pipe(sass({sourcemap: true, sourcemapPath: '../scss'}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['default']);
})