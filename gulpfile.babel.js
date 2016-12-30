import gulp from "gulp"
import gulpLoadPlugins from "gulp-load-plugins"
const $ = gulpLoadPlugins();

gulp.task("webserver", function() {
  gulp.src("./")
    .pipe($.webserver({
      host: '0.0.0.0',
      livereload: true,
    }));
});

gulp.task("assets", () => {
  gulp.src("./app/assets/**")
    .pipe($.plumber())
    .pipe(gulp.dest("dest/assets"))
});

gulp.task("js", () => {
  gulp.src("./app/scripts/*.js")
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(gulp.dest("dest/scripts"))
});

gulp.task("pug", () => {
  gulp.src(["./app/views/*.pug", "./app/*.pug"], {base: "app"})
    .pipe($.plumber())
    .pipe($.pug())
    .pipe(gulp.dest("dest"))
});

gulp.task("sass", () => {
  gulp.src("./app/styles/*.scss")
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest("dest/styles"))
});

gulp.task("default", ["assets", "webserver"], () => {
  gulp.watch("./app/styles/*.scss", ["sass"]);
  gulp.watch(["./app/views/*.pug", "./app/*.pug"], ["pug"]);
  gulp.watch("./app/scripts/*.js", ["js"]);
});

gulp.task("copy", () => {
  gulp.src("./dest/**")
    .pipe(gulp.dest("./"))
});

gulp.task("build", ["copy"], () => {});
