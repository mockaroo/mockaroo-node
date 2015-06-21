// Include gulp
var gulp = require('gulp');
var babel = require('gulp-babel');
var run = require('gulp-run');
var gutil = require('gulp-util');

// Transpile ES6 to JS
gulp.task('compile', function () {
    gulp.src('src/**/*.es6')
        .pipe(babel())
        .on('error', gutil.log)
        .pipe(gulp.dest('lib'))
});

// Generate documentation using ESDoc
gulp.task('esdoc', function() {
  run('esdoc -c esdoc.json').exec();
})

// Watch files for changes
gulp.task('watch', function() {
    var tasks = ['compile', 'esdoc'];
    gulp.start(tasks);
    gulp.watch('src/**/*.es6', tasks);
});

gulp.task('default', ['watch']);
