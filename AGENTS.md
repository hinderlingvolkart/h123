## Cursor Cloud specific instructions

### Project overview

h123 is an accessibility HTML5 heading outliner — a browser bookmarklet and cross-browser extension (Chrome, Firefox, Safari) that shows the heading structure of a page as a screenreader would see it. Pure client-side tool with a Node.js build pipeline. No backend services, databases, or API secrets.

### Build

- `yarn build` runs `node build.js`, which compiles, transpiles (Babel), minifies (Terser), packages extensions, and generates the GitHub Pages site into `docs/`.
- Build outputs (all in `dist/`, gitignored): `bookmarklet.js`, `bookmarklet.min.js`, `h123-chrome.zip`, `h123-firefox.zip`. Also generates `docs/index.html` (gitignored).
- `readme.md` is hand-written (not generated). The Pages content template is `src/readme.md`.
- The browserslist "caniuse-lite is outdated" warning is cosmetic and does not affect the build.

### CI

- Push to `main` triggers `.github/workflows/build.yml`: builds and deploys `docs/` to GitHub Pages.
- Pushing a `v*` tag triggers `.github/workflows/release.yml`: builds and attaches extension ZIPs to a GitHub Release.
- After merging, configure GitHub Pages source to "GitHub Actions" in repo Settings > Pages.

### Testing

There is no automated test suite. To manually test:
1. Run `yarn build` to produce `dist/`.
2. Serve the repo root: `npx http-server . -p 8081`.
3. **Bookmarklet**: open any page, then in DevTools Console run `fetch('http://localhost:8081/dist/bookmarklet.js').then(r=>r.text()).then(code=>eval(code))`.
4. **Extension**: unzip `dist/h123-chrome.zip` into a folder, load it as an unpacked extension in `chrome://extensions/` (Developer mode), then click the extension icon on any page.
5. The heading outline panel should appear on the right side. Skipped heading levels appear in red.

### Linting

No linter is configured in this project. There are no ESLint, Prettier, or similar configs.
