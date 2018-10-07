var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var cssmin = require("gulp-cssmin");
var rename = require("gulp-rename");
var sassLint = require("gulp-sass-lint");
var notify = require("gulp-notify");
var compass = require("gulp-compass");
var path = require("path");

// Static Server + watching scss/html files
gulp.task("serve", ["sass-lint"], function() {
  browserSync.init({
    server: "./app"
  });
  gulp.watch("app/scss/*.scss", ["sass-lint"]).on("change", browserSync.reload);
  gulp.watch("app/*.html").on("change", browserSync.reload);
  gulp.watch("app/js/*.js").on("change", browserSync.reload);
});

// sass-lint check
gulp.task("sass-lint", function(error) {
  return gulp
    .src("app/scss/**/*.s+(a|c)ss")
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError().on("error", error))
    .pipe(compass({ project: path.join(__dirname, "app"), sass: "scss" }))
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("app/css"))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream())
    .pipe(notify("CSS Compiled Successfully"));
});

gulp.task("default", ["serve"]);
