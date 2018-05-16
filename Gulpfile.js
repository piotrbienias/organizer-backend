var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    babel = require('gulp-babel'),
    node;


// run node server
gulp.task('server', function() {
    if (node) node.kill();

    node = spawn('node', ['build/index.js'], { stdio: 'inherit' });
    node.on('close', function(code) {
        if (code === 8) {
            gulp.log('Error detected');
        }
    });
});


// babel
gulp.task('babel', function() {
    gulp.src('src/**/*.js')
        .pipe(babel({
            presets: [['env', {
                "targets": {
                    "node": "current"
                }
            }]]
        }))
        .pipe(gulp.dest('build'));
});


gulp.task('default', function() {
    gulp.run(['babel', 'server']);

    gulp.watch(['./src/**/*.js'], ['babel', 'server']);
});