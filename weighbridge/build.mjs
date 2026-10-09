// Builds the Weighbridge documentation site: content/*.md  ->  dist/<slug>/index.html (+ search index, assets).
// No framework: a tiny front-matter reader, `marked` for the Markdown, and plain HTML templates.
//
// Page file:   content/<slug>.md   starting with
//   ---
//   title: Weigh a vehicle
//   category: Daily work
//   order: 1
//   summary: One line shown under the title and in search results.
//   ---
// Extras on top of Markdown:  :::tip / :::note / :::warn ... :::  callout blocks, and
//   ![Alt text](/img/name.png "Caption")  which becomes a captioned, click-to-zoom screenshot.
import { Marked } from 'marked'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const CONTENT = path.join(ROOT, 'content')
const DIST = process.env.OUT ? path.resolve(process.env.OUT) : path.join(ROOT, 'dist')
// BASE is the URL prefix the site is served under, e.g. "/app-docs/weighbridge" on GitHub Pages ("" at a domain root).
const BASE = (process.env.BASE || '').replace(/\/+$/, '')
const SITE = { name: 'Weighbridge Docs', product: 'Weighbridge', company: 'Mochan Labs', site: 'https://mochanlabs.com', email: 'mochanlabs@gmail.com' }

// Most important first; this is the order of the sidebar.
const CATEGORIES = [
  'Start here', 'Daily work', 'Troubleshooting', 'Setup', 'Integrations', 'Reports & records', 'Looking after the system', 'Reference',
]

// The footer says which app version the pages describe: the desktop app's own version when the repo is checked out
// next to this folder, else WB_VERSION, else a generic "0.2.x".
let VERSION = process.env.WB_VERSION || '0.2.x'
try { VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, '..', 'desktop', 'package.json'), 'utf8')).version } catch { /* standalone checkout */ }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function readFrontMatter(raw, file) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!m) throw new Error(`${file}: missing front matter`)
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  for (const k of ['title', 'category', 'order']) if (!meta[k]) throw new Error(`${file}: front matter needs "${k}"`)
  if (!CATEGORIES.includes(meta.category)) throw new Error(`${file}: unknown category "${meta.category}"`)
  meta.order = Number(meta.order)
  return { meta, body: m[2] }
}

// ---- Markdown ---------------------------------------------------------------------------------------------
function makeMarked(headings) {
  const marked = new Marked()
  marked.use({
    gfm: true,
    renderer: {
      heading(text, level, raw) {
        const id = slugify(raw)
        if (level === 1) return `<h1>${text}</h1>
`
        if (level === 2 || level === 3) headings.push({ id, text: raw, level })
        return `<h${level} id="${id}"><a class="anchor" href="#${id}" aria-label="Link to this section">#</a>${text}</h${level}>\n`
      },
      image(href, title, text) {
        const img = `<img src="${esc(href)}" alt="${esc(text)}" loading="lazy">`
        return `<figure class="shot"><button type="button" class="zoom" aria-label="Enlarge screenshot">${img}</button>${title ? `<figcaption>${esc(title)}</figcaption>` : ''}</figure>`
      },
      link(href, title, text) {
        const external = /^https?:/.test(href)
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${external ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`
      },
      table(header, body) { return `<div class="table-wrap"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>\n` },
    },
  })
  return marked
}

function render(body, headings) {
  const marked = makeMarked(headings)
  const ICON = { tip: 'Tip', note: 'Note', warn: 'Important' }
  // Callouts are rendered first (and their inner Markdown too) so they can hold lists and bold text.
  const withCallouts = body.replace(/^:::(tip|note|warn)[ \t]*\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, (_m, kind, inner) =>
    `\n<div class="callout callout-${kind}"><div class="callout-title">${ICON[kind]}</div>${marked.parse(inner.trim(), { async: false })}</div>\n`)
  return marked.parse(withCallouts, { async: false })
}

const plain = (html) => html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim()

// ---- load pages -------------------------------------------------------------------------------------------
const pages = fs.readdirSync(CONTENT).filter((f) => f.endsWith('.md')).map((file) => {
  const { meta, body } = readFrontMatter(fs.readFileSync(path.join(CONTENT, file), 'utf8'), file)
  const slug = file.replace(/\.md$/, '')
  const headings = []
  const html = render(body, headings)
  return { slug, ...meta, html, headings, url: slug === 'index' ? '/' : `/${slug}/`, text: plain(html) }
})
pages.sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.order - b.order)
const home = pages.find((p) => p.slug === 'index')
if (!home) throw new Error('content/index.md is required')

// Internal links: [text](slug) in Markdown are written as /slug/ already; verify they resolve.
const known = new Set(pages.map((p) => p.url))
for (const p of pages) {
  for (const m of p.html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
    if (!m[1].startsWith('/img/') && !known.has(m[1])) throw new Error(`${p.slug}: broken link ${m[1]}`)
  }
  for (const m of p.html.matchAll(/src="\/img\/([^"]+)"/g)) {
    if (!fs.existsSync(path.join(ROOT, 'assets', 'img', m[1]))) throw new Error(`${p.slug}: missing image ${m[1]}`)
  }
}

// ---- templates --------------------------------------------------------------------------------------------
function sidebar(current) {
  const all = current === home   // on the overview, show every category open
  return CATEGORIES.map((cat) => {
    const items = pages.filter((p) => p.category === cat && p.slug !== 'index')
    if (!items.length) return ''
    const open = all || items.some((p) => p === current)
    return `<div class="nav-group${open ? ' open' : ''}"><button type="button" class="nav-cat" aria-expanded="${open}">${esc(cat)}<span class="chev" aria-hidden="true"></span></button><ul>${
      items.map((p) => `<li><a href="${p.url}"${p === current ? ' aria-current="page"' : ''}>${esc(p.title)}</a></li>`).join('')}</ul></div>`
  }).join('\n')
}

function toc(page) {
  if (page.headings.length < 3) return ''
  return `<nav class="toc" aria-label="On this page"><div class="toc-title">On this page</div><ul>${
    page.headings.map((h) => `<li class="l${h.level}"><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ul></nav>`
}

function pager(page) {
  const list = pages.filter((p) => p.slug !== 'index')
  const i = list.indexOf(page)
  const prev = i > 0 ? list[i - 1] : null
  const next = i >= 0 && i < list.length - 1 ? list[i + 1] : null
  if (!prev && !next) return ''
  return `<nav class="pager" aria-label="Previous and next">${
    prev ? `<a class="prev" href="${prev.url}"><span>Previous</span>${esc(prev.title)}</a>` : '<span></span>'}${
    next ? `<a class="next" href="${next.url}"><span>Next</span>${esc(next.title)}</a>` : '<span></span>'}</nav>`
}

const LOGO = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16"/><path d="M6 20 9 8h6l3 12"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/></svg>`

const withBase = (html) => BASE ? html.replace(/(href|src)="\/(?!\/)/g, `$1="${BASE}/`) : html

function layout(page) {
  return withBase(layoutRaw(page))
}

function layoutRaw(page) {
  const isHome = page === home
  const title = isHome ? `${SITE.name} — ${SITE.company}` : `${page.title} — ${SITE.name}`
  const desc = page.summary || 'How to install, set up and use Weighbridge.'
  return `<!doctype html>
<html lang="en" data-theme="auto" data-base="${BASE}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<script>try{var t=localStorage.getItem('wb-docs-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
<link rel="stylesheet" href="/assets/docs.css">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1d4fb3"/><path d="M8 25h16M10 25l3-12h6l3 12M16 13V8" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')}">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="topbar">
  <button type="button" class="icon-btn menu-btn" aria-label="Open navigation" aria-controls="sidebar">☰</button>
  <a class="brand" href="/">${LOGO}<span>Weighbridge <em>Docs</em></span></a>
  <div class="search">
    <input id="q" type="search" placeholder="Search the docs…" autocomplete="off" aria-label="Search the docs">
    <kbd>/</kbd>
    <div id="results" class="results" hidden></div>
  </div>
  <button type="button" class="icon-btn theme-btn" aria-label="Switch light / dark">◐</button>
</header>
<div class="shell">
  <aside id="sidebar" class="sidebar" aria-label="Documentation">
    <a class="nav-home${isHome ? ' current' : ''}" href="/">Overview</a>
    ${sidebar(page)}
  </aside>
  <div class="scrim" hidden></div>
  <main id="main" class="content">
    <article>
      ${isHome ? '' : `<div class="crumbs"><a href="/">Docs</a> <span>/</span> ${esc(page.category)}</div><h1>${esc(page.title)}</h1>${page.summary ? `<p class="lead">${esc(page.summary)}</p>` : ''}`}
      ${page.html}
    </article>
    ${isHome ? '' : pager(page)}
    <footer class="foot">
      <span>© ${new Date().getFullYear()} ${SITE.company} · <a href="${SITE.site}" target="_blank" rel="noopener">mochanlabs.com</a> · <a href="mailto:${SITE.email}">${SITE.email}</a></span>
      <span>Applies to Weighbridge ${esc(VERSION)}</span>
    </footer>
  </main>
  ${isHome ? '' : `<aside class="toc-col">${toc(page)}</aside>`}
</div>
<div id="lightbox" class="lightbox" hidden><img alt=""><button type="button" aria-label="Close">×</button></div>
<script src="/assets/docs.js"></script>
</body>
</html>`
}

// ---- write ------------------------------------------------------------------------------------------------
fs.rmSync(DIST, { recursive: true, force: true })
fs.mkdirSync(DIST, { recursive: true })
for (const p of pages) {
  const dir = p.slug === 'index' ? DIST : path.join(DIST, p.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), layout(p))
}
fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true, filter: (s) => !s.endsWith('probe.json') && !s.includes(`${path.sep}img`) })
fs.cpSync(path.join(ROOT, 'assets', 'img'), path.join(DIST, 'img'), { recursive: true })
fs.writeFileSync(path.join(DIST, 'search.json'), JSON.stringify(pages.map((p) => ({
  t: p.title, c: p.category, u: p.url, s: p.summary || '', h: p.headings.map((h) => h.text).join(' · '), x: p.text.slice(0, 6000),
}))))
fs.writeFileSync(path.join(DIST, '404.html'), layout({ ...home, html: '<h1>Page not found</h1><p>That page doesn\'t exist. Try the search box above, or go back to the <a href="/">overview</a>.</p>', headings: [], summary: '' }))
console.log(`built ${pages.length} pages -> ${path.relative(process.cwd(), DIST) || '.'}`)
