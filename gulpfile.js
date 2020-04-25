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
const concatCss = require('gulp-concat-css');

let isDev = true;
let isProd = !isDev;

const conf = {
    dest: './build',
    source: './src',
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
            .src(conf.source + '/index.pug')
            .pipe(pug())
            .pipe(gulp.dest('./build'))
            .pipe(browserSync.stream());
    }

    return gulp
        .src(conf.source + '/index.html')
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}

function styles() {
    return gulp
        .src(conf.source + '/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(conf.source + '/css'))
        .pipe(browserSync.stream());
}

function allStyles() {
    return gulp
        .src(conf.source + '/css/**/*.css')
        .pipe(concatCss('./main.css'))
        .pipe(
            autoprefixer({
                cascade: false
            })
        )
        .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
        .pipe(gulp.dest(conf.dest + '/css'));
}

function fonts() {
    return gulp
        .src(conf.source + '/fonts/**/*')
        .pipe(gulp.dest(conf.dest + '/fonts'));
}

function scripts() {
    return gulp
        .src(conf.source + '/js/main.js')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(conf.dest + '/js'))
        .pipe(browserSync.stream());
}

function images() {
    return gulp
        .src(conf.source + '/img/**/*')
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

    gulp.watch(conf.source + '/sass/**/*.scss', gulp.series(styles, allStyles));
    gulp.watch(conf.source + '/js/**/*.js', scripts);

    if (conf.usePug) {
        gulp.watch(conf.source + '/**/*.pug', html);
    } else {
        gulp.watch(conf.source + '/index.html', html);
    }
}

function clean() {
    return del(['build/*']);
}

gulp.task('watch', watch);

let build = gulp.series(
    clean,
    gulp.parallel(html, styles, scripts, images, fonts),
    allStyles
);

gulp.task('build', build);

gulp.task('dev', gulp.series('build', 'watch'));
