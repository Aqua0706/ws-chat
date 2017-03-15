var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin');

var webpack = require('webpack');
var webpackStream = require("webpack-stream");
var webpackConfig = require('./webpack.config');

gulp.task('default',["clean","imagemin","minify-css","minify-js","webpack","css:watch","js:watch"]);


gulp.task("clean",function(){
   return gulp.src(['./public/build/**'],{
        read:false,
        force:true
    }).pipe(clean());
})

gulp.task('webpack',function(){
    return gulp
    .src('./')
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest("./public/build/js"))
});

gulp.task("minify-js",function(){
    gulp.src('./public/js/xss.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/build/js'))
});

gulp.task("minify-css",function(){
    return gulp.src('./public/css/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('./public/build/css'))
});


gulp.task("imagemin",function(){
    return gulp.src("./public/images/*.{jpg,jpeg,png}")
    .pipe(imagemin())
    .pipe(gulp.dest("./public/build/images"))
});

gulp.task("js:watch",function(){
    gulp.watch('./public/js/*.*',["webpack"]);
});

gulp.task("css:watch",function(){
    gulp.watch('./public/css/*.*',["minify-css"]);
})