const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const imgCompress = require('imagemin-jpeg-recompress');

let isDev = true;
let isProd = !isDev;

const conf = {
    dest: './build',
    usePug: false
};

let webpackConfig = {
    output: {
        filename: 'main.js'
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                },
                exclude: '/node_modules'
            }
        ]
    },
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : 'none'
};

function html() {
    if (conf.usePug === true) {
        return gulp
            .src('./src/index.pug')
            .pipe(pug())
            .pipe(gulp.dest('./build'))
            .pipe(browserSync.stream());
    }

    return gulp
        .src('./src/index.html')
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}

function styles() {
    return gulp
        .src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer({
                cascade: false
            })
        )
        .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
        .pipe(gulp.dest(conf.dest + '/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp
        .src('./src/js/main.js')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(conf.dest + '/js'))
        .pipe(browserSync.stream());
}

function images() {
    return gulp
        .src('./src/img/**/*')
        .pipe(
            imagemin([
                imgCompress({
                    loops: 4,
                    min: 70,
                    max: 80,
                    quality: 'high'
                }),
                imagemin.gifsicle(),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo()
            ])
        )
        .pipe(gulp.dest(conf.dest + '/img'));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });

    gulp.watch('./src/sass/**/*.scss', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./src/**/*.pug', html);
    gulp.watch('./src/index.html', html);
}

function clean() {
    return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);

gulp.task('watch', watch);

let build = gulp.series(clean, gulp.parallel(html, styles, scripts, images));

gulp.task('build', build);

gulp.task('dev', gulp.series('build', 'watch'));
