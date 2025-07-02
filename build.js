import { readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { execSync } from 'child_process';
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

function compileTypeScript() {
    try {
        // Compile TypeScript to JavaScript
        console.log('Compiling TypeScript...');
        execSync('npx tsc --outDir ./temp --skipLibCheck --target ES2015 --lib DOM,ES2015 --strict --esModuleInterop src/bookmarklet.ts', { stdio: 'inherit' });
        return readFile('temp/bookmarklet.js');
    } catch (error) {
        console.error('TypeScript compilation failed:', error.message);
        throw error;
    }
}

async function compile() {
    const html = readFile('src/bookmarklet.ui.html');
    const css = readFile('src/bookmarklet.ui.css');

    const cssResult = await postcss([autoprefixer]).process(css, { from: undefined });
    const updatedHtml = html.replace('{{css}}', cssResult.css);

    // Compile TypeScript to JavaScript
    let bookmarkletJS = compileTypeScript();
    
    // Replace the UI template
    bookmarkletJS = bookmarkletJS.replace('{{ui}}', prepareJSVariable(updatedHtml));

    // Transform with Babel for additional browser compatibility
    const transformedJS = transformSync(bookmarkletJS, { presets: ['@babel/preset-env'] }).code;

    writeFile('./dist/bookmarklet.js', transformedJS);

    const minifiedJS = (await minify(transformedJS)).code;

    writeFile('./dist/bookmarklet.min.js', minifiedJS);
    
    // Clean up temporary files
    try {
        execSync('rm -rf ./temp', { stdio: 'inherit' });
    } catch (error) {
        // Ignore cleanup errors
    }
}

async function build() {
    await compile();
    await buildChromeExtension();
    await generateReadme();
}

(async () => {
    await build();
})();
