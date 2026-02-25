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
    mkpath.sync(dirname(dst));
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

function buildExtensionZip(manifest) {
    const zip = new JSZip();
    const backgroundJS = readFile('src/extension/background.js');
    const bookmarkletJS = readFile('dist/bookmarklet.js');

    zip.file('manifest.json', manifest);
    zip.file('background.js', backgroundJS);
    zip.file('bookmarklet.js', bookmarkletJS);

    [16, 48, 128].forEach(size => {
        const icon = readFileSync(`./src/extension/icon-${size}.png`);
        zip.file(`icon-${size}.png`, icon, { base64: false, binary: true });
    });

    return zip;
}

async function buildExtensions() {
    const config = getPackageConfig();
    const rawManifest = readFile('src/extension/manifest.json');
    const baseManifest = replaceAll(rawManifest, {
        '{{name}}': 'Accessibility Heading Outliner',
        '{{description}}': 'See the heading outline like a screenreader.',
        '{{homepage}}': 'https://hinderlingvolkart.github.io/h123/',
        '{{version}}': config.version
    });

    const chromeZip = buildExtensionZip(baseManifest);
    const chromeContent = await chromeZip.generateAsync({ type: 'nodebuffer' });
    writeFileSync('./dist/h123-chrome.zip', chromeContent);

    const firefoxManifest = JSON.parse(baseManifest);
    firefoxManifest.browser_specific_settings = {
        gecko: {
            id: 'h123@hinderlingvolkart.com',
            strict_min_version: '109.0'
        }
    };
    const firefoxZip = buildExtensionZip(JSON.stringify(firefoxManifest, null, 4));
    const firefoxContent = await firefoxZip.generateAsync({ type: 'nodebuffer' });
    writeFileSync('./dist/h123-firefox.zip', firefoxContent);
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

    // Create dist directory if it doesn't exist
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
    await buildExtensions();
    await generateReadme();
}

(async () => {
    await build();
})();
