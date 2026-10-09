# Mochan Labs — application documentation

User documentation for Mochan Labs apps, published to GitHub Pages.

| App | Source | Live |
|---|---|---|
| Weighbridge | [`weighbridge/`](weighbridge) | https://mochanlabs-dev.github.io/app-docs/weighbridge/ |

## How it works

Each app is a folder with its own `build.mjs` (Markdown in `content/` → static HTML) and an `app.json` (`name`, `description`).
The root `build.mjs` builds them all into `dist/<app>/` plus a landing page. **Publish with `npm run deploy`**: it builds everything and
pushes the result to the `gh-pages` branch, which GitHub Pages serves. (`deploy/pages.yml` is a ready-made GitHub Actions workflow for
automatic deploys on every push. To use it, copy it to `.github/workflows/` using a login that has the `workflow` scope, then set
**Settings → Pages → Source** to *GitHub Actions*.)

## Add another app

1. Copy the `weighbridge/` folder as a starting point (or create `content/`, `assets/`, `build.mjs`, `app.json`, `package.json` + lock file).
2. Replace the pages in `content/` and the screenshots in `assets/img/`.
3. Add the app to the table above, commit, and run `npm run deploy`. It appears on the landing page automatically.

## Preview locally

```
cd weighbridge
npm ci
npm run dev      # http://localhost:4000
```

To test the whole site exactly as Pages serves it: `BASE=/app-docs node build.mjs` in the repo root, then open `dist/`
with any static file server.

## Custom domain

Add the domain under **Settings → Pages**, then deploy with `BASE= npm run deploy` (empty base) so links are rooted at `/`.

See [`weighbridge/README.md`](weighbridge/README.md) for writing pages and refreshing screenshots.
