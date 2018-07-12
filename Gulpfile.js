var gulp    = require('gulp'),
    babel   = require('gulp-babel'),
    nodemon = require('gulp-nodemon');


// babel
gulp.task('babel', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: [['env', {
                "targets": {
                    "node": "current"
                }
            }]]
        }))
        .pipe(gulp.dest('build'));
});


// nodemon
gulp.task('nodemon', ['babel'], function() {
    
    return nodemon({
        script: './build/index.js',
        ext: 'js',
        watch: 'src',
        tasks: ['babel']
    }).on('restart', function() {
        console.log('Server restarted');
    }).on('start', function() {
        console.log('Server started');
    });

});

gulp.task('default', ['nodemon']);