# h①②③ – Accessibility HTML5 Outliner

See the headings like a screenreader!

## Install

### Bookmarklet

Visit the [h123 homepage](https://hinderlingvolkart.github.io/h123/) and drag the **Show Headings** link to your bookmark bar.

### Browser extension

Download the latest extension from [Releases](https://github.com/hinderlingvolkart/h123/releases/latest):

- **Chrome** / **Edge** / **Brave** — `h123-chrome.zip`
- **Firefox** — `h123-firefox.zip`
- **Safari** — convert the Chrome ZIP using Apple's [safari-web-extension-converter](https://developer.apple.com/documentation/safariservices/converting-a-web-extension-for-safari)

## Why you should

Screenreaders navigate pages by heading hierarchy (h1 → h2 → h3 …). When heading levels are skipped, the page becomes hard to navigate for blind users.

h123 shows you the heading structure of any page *exactly* as a screenreader sees it:

- Only visible headings are shown (not `display:none`, not `aria-hidden`)
- Skipped heading levels are flagged in red
- Shadow DOM boundaries are traversed
- Visually-hidden headings can be highlighted

## Development

```
yarn install
yarn build
```

`yarn build` compiles the bookmarklet, packages the browser extensions, and generates the GitHub Pages site into `docs/`.

Build outputs (all in `dist/`):

| File | Description |
|---|---|
| `bookmarklet.js` | Transpiled bookmarklet |
| `bookmarklet.min.js` | Minified bookmarklet |
| `h123-chrome.zip` | Chrome / Edge / Brave extension (Manifest V3) |
| `h123-firefox.zip` | Firefox extension (Manifest V3) |

### CI

- **Push to `main`** — builds and deploys the GitHub Pages site.
- **Push a tag `v*`** — builds and creates a GitHub Release with the extension ZIPs attached.

## License

Hinderling Volkart AG
