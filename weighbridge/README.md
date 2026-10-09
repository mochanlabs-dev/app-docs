# Weighbridge documentation site

A small static site (no framework): Markdown pages in `content/` are built into `dist/` by `build.mjs`.

```
content/       one Markdown file per page (front matter: title, category, order, summary)
assets/        docs.css, docs.js and img/ (screenshots)
build.mjs      builds dist/ + search index
tools/         screenshot + demo-data tooling (not part of the site)
```

## Write or change a page

Create or edit `content/<slug>.md`:

```
---
title: Weigh a vehicle
category: Daily work        # Start here | Daily work | Troubleshooting | Setup | Integrations | Reports & records | Looking after the system | Reference
order: 1                    # position inside the category
summary: One line shown under the title and in search.
---
```

Extras: `:::tip`, `:::note`, `:::warn` … `:::` callouts, and `![Alt](/img/name.png "Caption")` for click-to-zoom screenshots.
Link to another page with `[text](/slug/)`. The build fails on a broken link or a missing image.

## Preview

```
npm install
npm run dev        # builds this app at the root path, then serves http://localhost:4000
```

## Deploy

This folder is one app inside the `app-docs` repo. Pushing to `main` builds and publishes it to GitHub Pages
(see the repo root README and `.github/workflows/pages.yml`). Live at https://mochanlabs-dev.github.io/app-docs/weighbridge/

## Refreshing the screenshots

`tools/` holds the capture tooling: `anonymize.sql` / `anonymize-extra.sql` turn a **copy** of a database into a safe demo database,
`seed-demo.mjs` adds demo traffic through the API, and `capture.cjs` + `capture-shots.cjs` photograph every screen with Electron.
Never run them against a real database, and never publish a screenshot taken from real customer data.
