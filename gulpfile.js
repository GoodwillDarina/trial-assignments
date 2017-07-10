const gulp = require('gulp'),
      less = require('gulp-less'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      del = require('del'),
      rigger = require('gulp-rigger'),
      plumber = require('gulp-plumber'),
      browserSync = require('browser-sync'),
      reload = browserSync.reload;

gulp.task('clean:css', cleanCss);
gulp.task('clean', clean);

gulp.task('compile:css', compileCss);
gulp.task('copy:images', copyImages);
gulp.task('copy:fonts', copyFonts);

gulp.task('server', startServer);

gulp.task('build', ['clean', 'copy:fonts', 'copy:images', 'compile:css'], copyIndex);

gulp.task('watcher:css', ['clean:css', 'compile:css'], copyIndex);
gulp.task('watch', ['build'], watch);

gulp.task('server:watch', ['server', 'build'], watch);
gulp.task('default', ['build']);

function startServer() {
  browserSync({
    server: {
      baseDir: "./app"
    },
    host: 'localhost',
    port: 3030
  });
}

function clean() {
  del.sync(['./app']);
  console.log('[--------] App folder was deleted');
}

function cleanCss() {
  del.sync(['./app/styles/**']);
}

function compileCss() {
  return gulp.src('./source/less/main.less')
      .pipe(less({ strictMath: true }))
      .pipe(postcss([
        autoprefixer({ browsers: ['> 1%', 'IE 9', 'IE 10']})
      ]))
      .pipe(gulp.dest('./app/css'));
}

function copyIndex() {
  return gulp.src('./source/index.html')
      .pipe(rigger())
      .pipe(gulp.dest('./app'))
      .pipe(reload({stream: true}));
}

function copyImages() {
  return gulp.src('./source/images/**/*.*')
      .pipe(plumber())
      .pipe(gulp.dest('./app/images'));
}

function copyFonts() {
  return gulp.src('./source/fonts/**/*.*')
      .pipe(plumber())
      .pipe(gulp.dest('./app/fonts'));
}

function watch() {
  gulp.watch(['./source/**/*.html', './source/less/**/*.less', './source/styles/**/*.css'], ['watcher:css']);
}
