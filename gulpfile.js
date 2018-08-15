var gulp = require('gulp');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
 
gulp.task('tarball', function() {
    gulp.src('./public/**/*')
    .pipe(tar('public.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('.'));
});