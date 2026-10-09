// Builds every app's docs into dist/<app>/ and a landing page at dist/index.html.
// An "app" is any folder here that has a build.mjs and an app.json ({ name, description }).
//   node build.mjs                      -> BASE defaults to "" (served from a domain root)
//   BASE=/app-docs node build.mjs       -> for GitHub Pages at https://<owner>.github.io/app-docs/
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(ROOT, 'dist')
const BASE = (process.env.BASE || '').replace(/\/+$/, '')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

fs.rmSync(DIST, { recursive: true, force: true })
fs.mkdirSync(DIST, { recursive: true })

const apps = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, d.name, 'build.mjs')) && fs.existsSync(path.join(ROOT, d.name, 'app.json')))
  .map((d) => ({ dir: d.name, ...JSON.parse(fs.readFileSync(path.join(ROOT, d.name, 'app.json'), 'utf8')) }))

for (const a of apps) {
  console.log(`\n== ${a.dir}`)
  execFileSync(process.execPath, ['build.mjs'], {
    cwd: path.join(ROOT, a.dir), stdio: 'inherit',
    env: { ...process.env, OUT: path.join(DIST, a.dir), BASE: `${BASE}/${a.dir}` },
  })
}

fs.writeFileSync(path.join(DIST, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mochan Labs — Product documentation</title>
<meta name="description" content="User documentation for Mochan Labs applications.">
<style>
:root{--bg:#f5f7fb;--panel:#fff;--text:#1a2233;--muted:#5b6579;--line:#e3e7ef;--brand:#1d4fb3}
@media(prefers-color-scheme:dark){:root{--bg:#0f1420;--panel:#171e2e;--text:#e6eaf3;--muted:#9aa5bb;--line:#263049;--brand:#6b9bff}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 "Segoe UI",system-ui,sans-serif}
main{max-width:760px;margin:0 auto;padding:64px 20px}h1{font-size:34px;margin:0 0 8px;letter-spacing:-.02em}
p.lead{color:var(--muted);margin:0 0 34px;font-size:18px}.grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
a.card{display:block;padding:20px;background:var(--panel);border:1px solid var(--line);border-radius:14px;color:inherit;text-decoration:none;transition:.15s}
a.card:hover{border-color:var(--brand);transform:translateY(-2px)}a.card b{display:block;font-size:19px;color:var(--brand);margin-bottom:4px}
a.card span{color:var(--muted);font-size:15px}footer{margin-top:48px;color:var(--muted);font-size:14px}footer a{color:var(--brand)}
</style></head><body><main>
<h1>Product documentation</h1><p class="lead">Guides for Mochan Labs applications.</p>
<div class="grid">${apps.map((a) => `<a class="card" href="${BASE}/${esc(a.dir)}/"><b>${esc(a.name)}</b><span>${esc(a.description || '')}</span></a>`).join('')}</div>
<footer>© ${new Date().getFullYear()} Mochan Labs · <a href="https://mochanlabs.com">mochanlabs.com</a> · <a href="mailto:mochanlabs@gmail.com">mochanlabs@gmail.com</a></footer>
</main></body></html>`)
fs.writeFileSync(path.join(DIST, '.nojekyll'), '')
console.log(`\nbuilt ${apps.length} app(s) -> dist/`)
