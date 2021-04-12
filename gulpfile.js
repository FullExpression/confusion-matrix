const gulp = require('gulp');

defaultTask = (cb) => {
  gulp.src('./googlef351eab58e398fdc.html')
    .pipe(gulp.dest('./dist/web-app'));
  cb();
}

exports.default = defaultTask