var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlReplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var duration = require('gulp-duration');
var eslint = require('gulp-eslint');
var babelify = require('babelify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');

var path = {
    CORE: 'node_modules/core',
    INDEX_HTML: 'src/index.html',
    START_HTML: 'src/start.html',
    DEST: 'dist',
    DEST_BUILD: 'dist/build',
    DEST_CSS: 'dist/css',
    INDEX_ENTRY_POINT: 'index.js',
    START_ENTRY_POINT: 'start.js',
    GULP_FILE: 'gulpfile.js',
    JS: 'src/js',
    SASS: 'src/sass'
};

var ALL_JS_FILES = [path.GULP_FILE, path.JS + '/**/*.js', 'node_modules/core/src/**/*.js'];

gulp.task('lint', function () {
    return gulp.src(ALL_JS_FILES).pipe(eslint())
        .pipe(eslint.format())
        // Brick on failure to be super strict
        .pipe(eslint.failOnError());
});

gulp.task('sass', function () {
    gulp.src(path.SASS + '/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.DEST_CSS));
});

gulp.task('watch', function () {
    gulp.watch(ALL_JS_FILES, ['lint']); //TODO Only lint the file that actually got changed, like with entries in watchify
    gulp.watch(path.SASS + '/**/*.scss', ['sass']);

    var entryFiles = [
        path.INDEX_ENTRY_POINT,
        path.START_ENTRY_POINT
    ];

    //TODO Break out the building part from the watching part. In other words: make gulp-task('build/bundle')
    entryFiles.forEach(function (entry) {
        var watcher = watchify(browserify({
            entries: [path.JS + '/' + entry],
            transform: [babelify.configure({
                presets: ["react", "es2015"]})],
            debug: true,
            cache: {}, packageCache: {}, fullPaths: true
        }));

        function pipeBundle(bundle) {
            bundle.on('error', function(err){
                console.log(err.message);
            })
                .pipe(plumber())
                .pipe(duration('rebuilding files: ' + entry))
                .pipe(source(entry))
                .pipe(gulp.dest(path.DEST_BUILD));
        }

        pipeBundle(watcher.on('update', function () {
            pipeBundle(watcher.bundle());
        }).bundle());
    });
});

gulp.task('default', ['lint', 'sass', 'watch']);


//gulp.task('copy', function () {
//    gulp.src([path.INDEX_HTML, path.START_HTML])
//        .pipe(gulp.dest(path.DEST));
//});

//gulp.watch([path.START_HTML, path.INDEX_HTML], ['copy']);


//gulp.task('build', function () {
//    browserify({
//        entries: [path.INDEX_ENTRY_POINT],
//        transform: [reactify]
//    })
//        .bundle()
//        .pipe(source(path.MINIFIED_OUT))
//        .pipe(streamify(uglify(path.MINIFIED_OUT)))
//        .pipe(gulp.dest(path.DEST_BUILD));
//});
//
//gulp.task('replaceHTML', function () {
//    gulp.src(path.HTML)
//        .pipe(htmlReplace({
//            'js': 'build/' + path.MINIFIED_OUT
//        }))
//        .pipe(gulp.dest(path.DEST));
//});
//
//gulp.task('production', ['replaceHTML', 'build']);
