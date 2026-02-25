## Cursor Cloud specific instructions

### Project overview

h123 is an accessibility HTML5 heading outliner — a browser bookmarklet and Chrome extension that shows the heading structure of a page as a screenreader would see it. It is a pure client-side tool with a Node.js build pipeline. There are no backend services, databases, or API secrets.

### Build

- `yarn build` runs `node build.js`, which compiles, transpiles (Babel), minifies (Terser), and packages everything into `dist/`.
- Build outputs: `dist/bookmarklet.js`, `dist/bookmarklet.min.js`, `dist/AccessibilityOutlinerChrome.zip`, and `docs/index.html`.
- The browserslist "caniuse-lite is outdated" warning is cosmetic and does not affect the build.

### Testing the bookmarklet

There is no automated test suite. To manually test:
1. Serve the repo root with any static HTTP server (e.g., `npx http-server . -p 8081`).
2. Open any HTML page in Chrome.
3. In DevTools Console, run: `fetch('http://localhost:8081/dist/bookmarklet.js').then(r=>r.text()).then(code=>eval(code))` to inject the bookmarklet.
4. The heading outline panel should appear on the right side. Skipped heading levels appear in red.

### Linting

No linter is configured in this project. There are no ESLint, Prettier, or similar configs.
