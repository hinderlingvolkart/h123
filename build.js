import { readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import mkpath from 'mkpath';
import JSZip from 'jszip';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { marked } from 'marked';
import { transformSync } from '@babel/core';
import { minify } from 'terser'

function readFile(dst) {
    return readFileSync(dst, 'utf8');
}

function writeFile(dst, content) {
    mkpath(dirname(dst));
    return writeFileSync(dst, content, 'utf8');
}

function replaceAll(str, obj) {
    for (let key in obj) {
        str = str.split(key).join(obj[key]);
    }
    return str;
}

function getBookmarklet() {
    const script = readFile('dist/bookmarklet.min.js');
    return `javascript:(function(){${encodeURIComponent(script)}}())`;
}

function getPackageConfig() {
    return JSON.parse(readFile('./package.json'));
}

function prepareJSVariable(str) {
    str = str.replace(/\s+/g, ' ');
    str = str.replace(/'/g, '\\\'');
    return str;
}

async function generateReadme() {
    const markdown = readFile('src/readme.md');
    const updatedMarkdown = replaceAll(markdown, { '{{bookmarklet}}': getBookmarklet() });
    writeFile('./readme.md', updatedMarkdown);

    const html = readFile('src/readme.html');
    const updatedHtml = replaceAll(html, { '{{content}}': marked(updatedMarkdown) });
    writeFile('./docs/index.html', updatedHtml);
}

async function buildChromeExtension() {
    const zip = new JSZip();
    const config = getPackageConfig();
    let manifest = readFile('src/chrome/manifest.json');
    manifest = replaceAll(manifest, {
        '{{name}}': 'Accessibility Heading Outliner',
        '{{description}}': 'See the heading outline like a screenreader.',
        '{{homepage}}': 'https://hinderlingvolkart.github.io/h123/',
        '{{version}}': config.version
    });

    const backgroundJS = readFile('src/chrome/background.js');
    const bookmarkletJS = readFile('dist/bookmarklet.js');

    zip.file('manifest.json', manifest);
    zip.file('background.js', backgroundJS);
    zip.file('bookmarklet.js', bookmarkletJS);

    [16, 48, 128].forEach(size => {
        const icon = readFileSync(`./src/chrome/icon-${size}.png`);
        zip.file(`icon-${size}.png`, icon, { base64: false, binary: true });
    });

    const content = await zip.generateAsync({ type: 'nodebuffer' });
    writeFileSync('./dist/AccessibilityOutlinerChrome.zip', content);
}

async function compile() {
    let html = readFile('src/bookmarklet.ui.html');
    const css = readFile('src/bookmarklet.ui.css');

    const cssResult = await postcss([autoprefixer]).process(css, { from: undefined });
    
    // Remove the <style>{{css}}</style> block from the HTML template.
    // This makes the HTML purely structural.
    html = html.replace('<style>{{css}}</style>', '');

    let bookmarkletJS = readFile('src/bookmarklet.js');
    // Inject the structural HTML into the {{ui}} placeholder
    bookmarkletJS = bookmarkletJS.replace('{{ui}}', prepareJSVariable(html));
    // Inject the processed CSS into the /* {{css_string_placeholder}} */ placeholder
    // We use prepareJSVariable to ensure the CSS string is properly escaped for JS.
    bookmarkletJS = bookmarkletJS.replace('/* {{css_string_placeholder}} */', prepareJSVariable(cssResult.css));

    const transformedJS = transformSync(bookmarkletJS, { presets: ['@babel/preset-env'] }).code;

    writeFile('./dist/bookmarklet.js', transformedJS);

    const minifiedJS = (await minify(transformedJS)).code;

    writeFile('./dist/bookmarklet.min.js', minifiedJS);
}

async function build() {
    await compile();
    await buildChromeExtension();
    await generateReadme();
}

(async () => {
    await build();
})();
