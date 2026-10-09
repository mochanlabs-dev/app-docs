// Takes the documentation screenshots by driving the real web app in Electron (already a dependency of the
// desktop shell, so nothing extra to install).
//
//   desktop/node_modules/.bin/electron docs-site/tools/capture.cjs
//
// Needs a running DEMO app (see anonymize.sql / seed-demo.mjs), reachable at BASE. Environment:
//   BASE       web address            (default http://localhost:5173)
//   OUT        folder for the PNGs    (default docs-site/assets/img)
//   DEMO_PASS  the demo Admin password (required)
//   MODE       "probe" only dumps each screen's text to OUT/../probe.json, "shots" takes the screenshots
const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')

const BASE = process.env.BASE || 'http://localhost:5173'
const OUT = process.env.OUT || path.join(__dirname, '..', 'assets', 'img')
const PASS = process.env.DEMO_PASS
const MODE = process.env.MODE || 'shots'
const PHASE = process.env.PHASE || 'all'   // "pre" = before activation, "post" = after, "all" = both
if (!PASS) { console.error('Set DEMO_PASS.'); process.exit(1) }
fs.mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const probe = {}

app.disableHardwareAcceleration()

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1366, height: 820, show: false, useContentSize: true,
    // Off-screen rendering: a hidden normal window never paints, so capturePage() would wait forever.
    webPreferences: { backgroundThrottling: false, contextIsolation: true, offscreen: true, partition: 'docs-capture' }, // in-memory session: starts empty every run
  })
  win.webContents.setFrameRate(30)
  console.log('capture: window ready')
  const wc = win.webContents
  const js = (code) => wc.executeJavaScript(code, true)
  const log = (...a) => console.log(...a)

  async function go(p, wait = 1800) { log('loading', p); await win.loadURL(BASE + p); await sleep(wait) }
  async function waitFor(fnBody, ms = 8000) {
    const end = Date.now() + ms
    while (Date.now() < end) { if (await js(`(()=>{ try { return !!(${fnBody}) } catch { return false } })()`)) return true; await sleep(250) }
    return false
  }
  const clickText = (text, scopeSel = 'body') => js(`(()=>{ const root = document.querySelector(${JSON.stringify(scopeSel)}) || document.body;
      const els = [...root.querySelectorAll('button, a, [role=button], [role=tab], [role=menuitem], li, label')];
      const el = els.find(e => e.textContent.trim().replace(/\\s+/g,' ').startsWith(${JSON.stringify(text)}));
      if (!el) return false; el.scrollIntoView({block:'center'}); el.click(); return true })()`)
  const text = () => js(`document.body.innerText.replace(/\\n{3,}/g,'\\n\\n')`)

  async function shot(name, opts = {}) {
    if (opts.pre) await opts.pre()
    await sleep(opts.wait ?? 600)
    if (MODE === 'probe') { probe[name] = await text(); log('probed', name); return }
    const img = await wc.capturePage()
    fs.writeFileSync(path.join(OUT, name + '.png'), img.toPNG())
    log('shot', name)
  }

  async function login() {
    await go('/login', 800)
    const ok = await js(`(async()=>{
      const r = await fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({userName:'Admin',password:${JSON.stringify(PASS)}})});
      const j = await r.json(); if(!j.token) return false;
      const p = await (await fetch('/api/auth/permissions',{headers:{authorization:'Bearer '+j.token}})).json();
      localStorage.setItem('weighbridge.auth', JSON.stringify({token:j.token,userName:j.userName,roleName:j.roleName,mustChangePassword:false,permissions:p}));
      localStorage.setItem('weighbridge.theme','light'); return true })()`)
    if (!ok) throw new Error('login failed')
  }

  try {
    if (PHASE === 'pre' || PHASE === 'all') {
      // ---- first run, before the license is activated
      await go('/login', 2500)
      await shot('activation')

      // ---- the start-up loader and the "can't connect" screen (block the database check to simulate it)
      wc.session.webRequest.onBeforeRequest({ urls: ['*://*/api/health/db*'] }, (_d, cb) => cb({ cancel: true }))
      await win.loadURL(BASE + '/'); await sleep(8000)
      await shot('startup-loader')
      await sleep(15000)
      await shot('startup-problem')
      wc.session.webRequest.onBeforeRequest(null)
    }

    if (PHASE === 'post' || PHASE === 'all') {
      await login()

      const pages = {
        'dashboard': '/dashboard',
        'token-entry': '/weighment/token',
        'sale': '/weighment/sale',
        'purchase': '/weighment/purchase',
        'materials': '/masters/materials',
        'parties': '/masters/parties',
        'vehicles': '/masters/vehicles',
        'party-rates': '/masters/party-rates',
        'daily-log': '/reports/daily-log',
        'sale-reports': '/reports/sale-register',
        'purchase-reports': '/reports/purchase-register',
        'sync-status': '/reports/sync',
        'users': '/admin/users',
        'roles': '/admin/roles',
        'company': '/admin/company',
        'workflow': '/admin/workflow',
        'device': '/admin/device',
        'camera': '/admin/camera',
        'rfid': '/admin/rfid',
        'printer': '/admin/printer',
        'tally': '/admin/tally',
        'mdtss': '/admin/mdtss',
        'backup': '/admin/backup',
        'deployment': '/admin/deployment',
        'license': '/admin/license',
        'updates': '/admin/updates',
        'about': '/admin/about',
        'change-password': '/change-password',
      }

      if (MODE === 'probe') {
        for (const [name, route] of Object.entries(pages)) { await go(route, 2200); await shot(name) }
        fs.writeFileSync(path.join(OUT, '..', 'probe.json'), JSON.stringify(probe, null, 1))
      } else {
        require('./capture-shots.cjs')({ win, wc, js, go, shot, sleep, waitFor, clickText, login, pages, log, BASE })
          .then(null, (e) => { console.error('shots failed:', e); })
          .finally(() => app.quit())
        return
      }
    }
  } catch (e) {
    console.error('capture failed:', e)
  }
  app.quit()
})
