(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var root = document.documentElement

  // ---- theme: auto -> light -> dark -> auto
  var themeBtn = $('.theme-btn')
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme')
    var dark = cur === 'dark' || (cur === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    var next = dark ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    try { localStorage.setItem('wb-docs-theme', next) } catch (e) {}
  })

  // ---- sidebar: collapsible groups + mobile drawer
  $$('.nav-cat').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.parentNode, open = g.classList.toggle('open')
      b.setAttribute('aria-expanded', open)
    })
  })
  var scrim = $('.scrim')
  function setNav(open) { document.body.classList.toggle('nav-open', open); if (scrim) scrim.hidden = !open }
  var menu = $('.menu-btn')
  if (menu) menu.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')) })
  if (scrim) scrim.addEventListener('click', function () { setNav(false) })
  $$('.sidebar a').forEach(function (a) { a.addEventListener('click', function () { setNav(false) }) })
  var cur = $('.sidebar [aria-current="page"]')
  if (cur && cur.scrollIntoView) { try { cur.scrollIntoView({ block: 'center' }) } catch (e) {} }

  // ---- "On this page" highlight
  var links = $$('.toc a')
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {}
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a })
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('on') })
          var a = byId[e.target.id]; if (a) a.classList.add('on')
        }
      })
    }, { rootMargin: '-72px 0px -70% 0px' })
    $$('article h2[id], article h3[id]').forEach(function (h) { io.observe(h) })
  }

  // ---- screenshots: click to enlarge
  var lb = $('#lightbox')
  if (lb) {
    var lbImg = $('img', lb)
    function closeLb() { lb.hidden = true; lbImg.removeAttribute('src') }
    $$('.shot .zoom').forEach(function (b) {
      b.addEventListener('click', function () { var i = $('img', b); lbImg.src = i.src; lbImg.alt = i.alt; lb.hidden = false })
    })
    lb.addEventListener('click', closeLb)
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb() })
  }

  // ---- search (index is built at deploy time: /search.json)
  var q = $('#q'), box = $('#results'), index = null, active = -1
  function load(cb) {
    if (index) return cb()
    fetch((root.getAttribute('data-base') || '') + '/search.json').then(function (r) { return r.json() }).then(function (j) { index = j; cb() }).catch(function () { index = [] ; cb() })
  }
  function score(p, terms) {
    var t = p.t.toLowerCase(), h = p.h.toLowerCase(), s = p.s.toLowerCase(), x = p.x.toLowerCase(), total = 0
    for (var i = 0; i < terms.length; i++) {
      var w = terms[i], hit = 0
      if (t.indexOf(w) > -1) hit += 10
      if (h.indexOf(w) > -1) hit += 5
      if (s.indexOf(w) > -1) hit += 3
      if (x.indexOf(w) > -1) hit += 1
      if (!hit) return 0
      total += hit
    }
    return total
  }
  function snippet(p, terms) {
    var x = p.x, lx = x.toLowerCase(), at = -1
    for (var i = 0; i < terms.length && at < 0; i++) at = lx.indexOf(terms[i])
    if (at < 0) return p.s
    var from = Math.max(0, at - 50)
    return (from > 0 ? '…' : '') + x.slice(from, from + 150) + '…'
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function run() {
    var terms = q.value.toLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) { box.hidden = true; return }
    load(function () {
      var hits = index.map(function (p) { return { p: p, s: score(p, terms) } }).filter(function (r) { return r.s > 0 }).sort(function (a, b) { return b.s - a.s }).slice(0, 8)
      active = -1
      box.innerHTML = hits.length ? hits.map(function (r) {
        return '<a href="' + (root.getAttribute('data-base') || '') + r.p.u + '"><span class="cat">' + esc(r.p.c) + '</span><b>' + esc(r.p.t) + '</b><small>' + esc(snippet(r.p, terms)) + '</small></a>'
      }).join('') : '<div class="none">No pages match “' + esc(q.value) + '”.</div>'
      box.hidden = false
    })
  }
  if (q) {
    q.addEventListener('input', run)
    q.addEventListener('focus', function () { if (q.value) run() })
    q.addEventListener('keydown', function (e) {
      var items = $$('a', box)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); if (!items.length) return
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
        items.forEach(function (a, i) { a.classList.toggle('active', i === active) })
      } else if (e.key === 'Enter' && items.length) { items[Math.max(active, 0)].click(); location.href = items[Math.max(active, 0)].href }
      else if (e.key === 'Escape') { box.hidden = true; q.blur() }
    })
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) box.hidden = true })
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== q && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); q.focus() }
    })
  }
})()
