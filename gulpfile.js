const gulp = require('gulp')
const fs = require('fs')
const del = require('del')
const inlineStr = require('gulp-inline-str')
const babel = require('gulp-babel')

const babelOptions = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'))

const paths = {
  scripts: [ 'src/index.js'],
  destination: './lib',
}

gulp.task('clean', function() {
  return del([ paths.destination + '/*.js' ])
})

gulp.task('build', function() {
  return gulp
    .src(paths.scripts)
    .pipe(inlineStr({ basePath: paths.destination }))
    .pipe(babel(babelOptions))
    .pipe(gulp.dest(paths.destination))
})

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, gulp.series([ 'build' ]))
})

// The default task (called when you run `gulp` from cli)
gulp.task('default', gulp.series([ 'build' ]))
