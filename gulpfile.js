const gulp = require("gulp");
const svgo = require("gulp-svgo");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const watch = require("gulp-watch");
const modernizr = require("gulp-modernizr");
const htmlmin = require("gulp-htmlmin");
const cssmin = require("gulp-cssmin");
const rename = require("gulp-rename");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const fonter = require("gulp-fonter");

/** Generating a cascading style file */

gulp.task("gen-scss", () => {
   return gulp
      .src("./source/styles/scss/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass().on("Error: ", sass.logError))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./source/styles/css/"));
});

/** Generating a otf2ttf format fonts */

gulp.task("gen-font-ttf", () => {
   return gulp
      .src("./source/fonts/basic/**/*.otf")
      .pipe(fonter({ formats: ["ttf"] }))
      .pipe(gulp.dest("./source/fonts/opt/"));
});

/** Generating a all2woff format fonts */

gulp.task("gen-font", () => {
   gulp
      .src(["./source/fonts/basic/**/*.ttf"])
      .pipe(ttf2woff())
      .pipe(gulp.dest("./source/fonts/opt/"));
   return gulp
      .src(["./source/fonts/basic/**/*.ttf"])
      .pipe(ttf2woff2())
      .pipe(gulp.dest("./source/fonts/opt/"));
});

/** Optimization and minification SVG files */

gulp.task("gen-svgo", async () => {
   return gulp
      .src("./source/img/basic/**/*.svg")
      .pipe(svgo())
      .pipe(gulp.dest("./source/img/opt/"));
});

/** Minimizing a JS, CSS, HTML files */

gulp.task("min-js", async () => {
   return gulp
      .src("./source/js/**/*.js")
      .pipe(modernizr())
      .pipe(gulp.dest("./public/js/"));
});

gulp.task("min-html", async () => {
   return gulp
      .src("./source/**/*.html")
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest("./public/"));
});

gulp.task("min-css", async () => {
   gulp
      .src("./source/styles/css/**/*.css")
      .pipe(cssmin())
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest("./public/styles/css/"));
});

/** Observers */

gulp.task("observe", () => {
   gulp.watch("./source/styles/scss/**/*.scss", gulp.series("gen-scss"));
   gulp.watch("./source/img/basic/icons/**/*.svg", gulp.series("gen-svgo"));
});

gulp.task("observe-scss", () => {
   gulp.watch("./source/styles/scss/**/*.scss", gulp.series("gen-scss"));
});

gulp.task("observe-svgo", () => {
   gulp.watch("./source/img/basic/icons/**/*.svg", gulp.series("gen-svgo"));
});

/** Control commands */

gulp.task("public", async () => {
   gulp.series("min-html", "min-css", "min-js");
});