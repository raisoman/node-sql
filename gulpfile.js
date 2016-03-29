var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jsFiles = ['*.js', 'src/**/*.js'],
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs');

gulp.task('style', function () {
    //When i return it, i can use it as a subtask somewhere else
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('serve', ['style'], function() {
    var options = {
        script: 'app.js',
        delayTime : 1,
        env: {
            'PORT': 5000
        },
        watch: jsFiles
    };
    return nodemon(options)
    .on('restart', function(ev) {
        console.log('restarting...');
    });
});