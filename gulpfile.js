var gulp = require('gulp'),
    autoprefixer = require('autoprefixer'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    MakePath = require('mkpath'),
    Path = require('path'),
    FS = require('fs');




function getBookmarklet() {
    var script = readFile('dist/bookmarklet.min.js');
    return 'javascript:(function(){' + encodeURIComponent(script) + '}())';
}

function getPackageConfig() {
    return JSON.parse(readFile('./package.json'));
}

function prepareJSVariable(str) {
    str = str.replace(/\s+/g, ' ');
    str = str.replace(/'/g, '\\\'');
    return str;
}

gulp.task('readme', ['compile'], function(cb) {
    var marked = require('marked');
    var markdown = readFile('src/readme.md');
    markdown = replaceAll(markdown, {
        '{{bookmarklet}}': getBookmarklet()
    });
    writeFile('./readme.md', markdown);

    var html = readFile('src/readme.html');
    html = replaceAll(html, {
        '{{content}}': marked(markdown)
    });
    writeFile('./docs/index.html', html);

    cb();
});



// Build


gulp.task('chrome', ['compile'], function(cb) {
    var zip = new require('jszip')();
    var config = getPackageConfig();
    var manifest = readFile('src/chrome/manifest.json');
    manifest = replaceAll(manifest, {
        '{{name}}': 'Accessibility Heading Outliner',
        '{{description}}': 'See the heading outline like a screenreader.',
        '{{homepage}}': 'https://hinderlingvolkart.github.io/h123/',
        '{{version}}': config.version
    });
    var backgroundJS = readFile('src/chrome/background.js');
    var bookmarkletJS = readFile('dist/bookmarklet.js');

    zip.file('manifest.json', manifest);
    zip.file('background.js', backgroundJS);
    zip.file('bookmarklet.js', bookmarkletJS);
    [16,48,128].forEach(function(size) {
        var icon = FS.readFileSync('./src/chrome/icon-' + size + '.png');
        zip.file('icon-' + size + '.png', icon, {
            base64: false,
            binary: true
        });
    })
    zip
        .generateNodeStream({type:'nodebuffer',streamFiles:true})
        .pipe(FS.createWriteStream('./dist/AccessibilityOutlinerChrome.zip'))
        .on('finish', cb);
});


gulp.task('compile', function(cb) {
    var postcss = require('postcss');
    var autoprefixer = require('autoprefixer');

    var html = readFile('src/bookmarklet.ui.html');
    var css = readFile('src/bookmarklet.ui.css');

    postcss([autoprefixer])
        .process(css)
        .then(function(cssResult) {
            html = html.replace('{{css}}', cssResult.css);
            var stream = gulp.src('src/*.js')
                .pipe(replace('{{ui}}', prepareJSVariable(html)))
                .pipe(gulp.dest('./dist'))
                .pipe(uglify())
                .pipe(rename('bookmarklet.min.js'))
                .pipe(gulp.dest('./dist'))
                .on('end', cb);
        });
});

gulp.task('build', ['compile', 'chrome', 'readme']);


// Macro tasks
gulp.task('work', ['build']);
gulp.task('default', ['build']);









// util

function readFile(dst) {
    return FS.readFileSync(dst, 'utf8');
}

function writeFile(dst, content) {
    MakePath(Path.dirname(dst));
    return FS.writeFileSync(dst, content, 'utf8');
}

function replaceAll(str, obj) {
    for (var key in obj) {
        str = str.split(key).join(obj[key]);
    }
    return str;
}
