// The screenshot list for the documentation site. Called by capture.cjs (PHASE=post, MODE=shots) once the demo
// app is activated, seeded and signed in. Every shot is wrapped so one failure doesn't lose the rest.
module.exports = async function ({ win, wc, js, go, shot, sleep, waitFor, clickText, login, pages, log }) {
  // Real values that appear on a few screens are replaced with harmless ones before each capture.
  const SCRUB = `(()=>{
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; while ((n = walker.nextNode())) {
      let t = n.nodeValue, o = t;
      t = t.replace(/\\b[0-9a-f]{64}\\b/g, '9f2c41a7d3b85e60c1f4a98b27de503a6b1c8e4f7a2d95036e1b48c7f0a3d256');
      t = t.replace(/\\b192\\.168\\.\\d+\\.\\d+\\b/g, '192.168.1.20');
      t = t.replace(/Weighbridge_docs/g, 'Weighbridge');
      if (t !== o) n.nodeValue = t;
    }})()`

  const snap = (name, opts = {}) =>
    shot(name, { ...opts, wait: opts.wait ?? 400, pre: async () => { if (opts.pre) await opts.pre(); await js(SCRUB); if (!opts.keepScroll) await js(`[...document.querySelectorAll('*')].forEach(e=>{ if (e.scrollTop>0 && !e.closest('[role=dialog]')) e.scrollTop=0 })`) } })
      .catch((e) => log('FAILED', name, e.message))

  const dumpInputs = (name) => js(`JSON.stringify([...document.querySelectorAll('input,textarea')].filter(i=>i.type!=='password').map(i=>(i.labels&&i.labels[0]?i.labels[0].textContent:i.placeholder||i.name)+'='+i.value).filter(s=>!/=$/.test(s)))`)
    .then((v) => log('inputs', name, v))

  // MUI's <Select> opens on mousedown rather than click.
  const openSelect = (label) => js(`(()=>{ const l=[...document.querySelectorAll('label')].find(x=>x.textContent.trim().startsWith(${JSON.stringify(label)}));
    const c=l && (l.closest('.MuiFormControl-root')||l.parentElement).querySelector('[role=combobox]'); if(!c) return false;
    c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0})); return true })()`)
  const pickOption = (text) => js(`(()=>{ const o=[...document.querySelectorAll('[role=option]')].find(x=>x.textContent.trim().startsWith(${JSON.stringify(text)})) || document.querySelector('[role=option]:not([aria-disabled=true])');
    if(!o) return false; o.click(); return true })()`)
  const typeInto = (label, value) => js(`(()=>{ const l=[...document.querySelectorAll('label')].find(x=>x.textContent.trim().startsWith(${JSON.stringify(label)}));
    const i=l && (l.closest('.MuiFormControl-root')||l.parentElement).querySelector('input,textarea'); if(!i) return false;
    const set=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i),'value').set; set.call(i,${JSON.stringify(value)}); i.dispatchEvent(new Event('input',{bubbles:true})); return true })()`)
  const settle = async () => { await sleep(1500) }
  const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null
  const want = (k) => !ONLY || ONLY.includes(k)
  // A real mouse click at an element's centre (some MUI widgets ignore synthetic events).
  const rectOf = (fnBody) => js(`(()=>{ const el=(${fnBody}); if(!el) return null; el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); return {x:Math.round(r.left+r.width/2), y:Math.round(r.top+r.height/2)} })()`)
  const realClick = async (fnBody) => {
    const r = await rectOf(fnBody); if (!r) return false
    wc.sendInputEvent({ type: 'mouseMove', x: r.x, y: r.y })
    wc.sendInputEvent({ type: 'mouseDown', x: r.x, y: r.y, button: 'left', clickCount: 1 })
    wc.sendInputEvent({ type: 'mouseUp', x: r.x, y: r.y, button: 'left', clickCount: 1 })
    return true
  }
  const comboByLabel = (label) => `(()=>{ const l=[...document.querySelectorAll('label')].find(x=>x.textContent.trim().startsWith(${JSON.stringify(label)})); return l && (l.closest('.MuiFormControl-root')||l.parentElement).querySelector('[role=combobox]') })()`
  const optionByText = (text) => `[...document.querySelectorAll('[role=option]')].find(x=>x.textContent.includes(${JSON.stringify(text)}))`

  // ---- sign-in screen (needs an empty session)
  if (want('login')) try {
    await go('/login', 600)
    await js(`localStorage.removeItem('weighbridge.auth')`)
    await go('/login', 1500)
    await snap('login')
  } catch (e) { log('FAILED login', e.message) }
  await login()

  // ---- every plain screen
  const plain = ['dashboard', 'sale', 'purchase', 'materials', 'parties', 'vehicles', 'daily-log', 'sale-reports', 'purchase-reports',
    'sync-status', 'users', 'roles', 'company', 'workflow', 'device', 'camera', 'rfid', 'printer', 'tally', 'mdtss', 'backup', 'deployment',
    'license', 'about']
  for (const name of want('plain') ? plain : []) {
    try { await go(pages[name], 2200); if (['tally', 'mdtss', 'camera', 'device', 'rfid', 'deployment', 'printer', 'workflow'].includes(name)) await dumpInputs(name); await snap(name) }
    catch (e) { log('FAILED', name, e.message) }
  }

  // ---- token page: new entry, then the exit tab with an open token chosen
  if (want('token')) try {
    await go(pages['token-entry'], 2200)
    await typeInto('Vehicle number', 'UK07CA7790'); await realClick(comboByLabel('Material')); await sleep(500); await realClick(optionByText('20MMCR')); await sleep(400)
    await typeInto('Driver', 'Rajesh Kumar'); await typeInto('Place', 'Sitarganj'); await sleep(500)
    await clickText('Enter weight manually'); await sleep(900)
    await typeInto('Weight (kg)', '11250'); await typeInto('Reason', 'Indicator display unavailable'); await sleep(500)
    await snap('token-entry', { wait: 500 })
    await clickText('Exit'); await sleep(1000)
    await realClick(comboByLabel('Token')); await sleep(600)
    log('token options', await js(`[...document.querySelectorAll('[role=option]')].map(o=>o.textContent).join(' ## ')`))
    await realClick(optionByText('UK06CD2208')); await sleep(1200)
    await clickText('Enter weight manually'); await sleep(900)
    await typeInto('Weight (kg)', '28600'); await typeInto('Reason', 'Indicator display unavailable'); await sleep(500)
    await snap('token-exit', { wait: 500 })
  } catch (e) { log('FAILED token', e.message) }

  // ---- sale billing dialog (the vehicle waiting to be billed), with one line filled in
  if (want('billing')) try {
    await go(pages['sale'], 2200)
    await clickText('Complete billing'); await sleep(1800)
    await clickText('Add line'); await sleep(900)
    await realClick(`document.querySelector('[role=dialog] tbody [role=combobox]')`); await sleep(600)
    log('line options', await js(`[...document.querySelectorAll('[role=option]')].slice(0,5).map(o=>o.textContent).join(' ## ')`))
    await realClick(optionByText('40MMCR')); await sleep(1200)
    await snap('sale-billing', { wait: 500 })
  } catch (e) { log('FAILED sale-billing', e.message) }

  // ---- party rates with a party chosen
  if (want('rates')) try {
    await go(pages['party-rates'], 2000)
    await js(`(()=>{ const i=document.querySelector('input[placeholder^="Search by name"]'); if(!i) return; i.focus(); i.dispatchEvent(new MouseEvent('mousedown',{bubbles:true})); })()`)
    await typeInto('Party', 'Gayatri'); await sleep(900)
    await pickOption('Gayatri'); await sleep(1500)
    await snap('party-rates', { wait: 500 })
  } catch (e) { log('FAILED party-rates', e.message) }

  // ---- printed receipts
  for (const [name, route] of !want('prints') ? [] : [['slip-sale', '/print/slip/Sale/1'], ['slip-token', '/print/slip/TokenIn/10'], ['slip-purchase', '/print/slip/Purchase/13'], ['invoice', '/print/invoice/1']]) {
    try { await go(route, 2500); await snap(name) } catch (e) { log('FAILED', name, e.message) }
  }

  // ---- dark theme
  if (want('dark')) try {
    await js(`localStorage.setItem('weighbridge.theme','dark-grey')`)
    await go(pages['dashboard'], 2200); await snap('dashboard-dark')
    await js(`localStorage.setItem('weighbridge.theme','light')`)
  } catch (e) { log('FAILED dark', e.message) }
}
