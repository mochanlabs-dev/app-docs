// Creates a day of believable demo traffic through the app's own API, for documentation screenshots:
// completed sales and purchases, a vehicle waiting to be billed, and a couple still on the platform.
// Run against a demo database only (see anonymize.sql):  node seed-demo.mjs http://localhost:5080
const base = process.argv[2] ?? 'http://localhost:5080'
const user = process.env.DEMO_USER ?? 'Admin'
const pass = process.env.DEMO_PASS

if (!pass) { console.error('Set DEMO_PASS to the demo database Admin password.'); process.exit(1) }

async function call(path, method = 'GET', body, token) {
  const res = await fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json = null
  try { json = text ? JSON.parse(text) : null } catch { /* not json */ }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text.slice(0, 200)}`)
  return json
}

const { token } = await call('/api/auth/login', 'POST', { userName: user, password: pass })
const api = (p, m, b) => call(p, m, b, token)
const parties = await api('/api/masters/parties')
const party = (name) => parties.find((p) => p.name === name)?.id ?? parties[0].id

const round2 = (n) => Math.round(n * 100) / 100
const REASON = 'Demo data'

// Sales: vehicle arrives empty (entry), leaves loaded (exit) -> exit > entry. Weights in kg; qty billed in Qtl (kg / 100).
const sales = [
  { plate: 'UK07CA7781', material: '20MMCR', party: 'Gayatri Contractors', driver: 'Balam Singh', place: 'Kharghatiya', empty: 10900, loaded: 43800, rate: 70, type: 'Credit' },
  { plate: 'UK06CB4410', material: 'SAND',   party: 'Kumar Traders',        driver: 'Ravi Kumar',   place: 'Sitarganj',   empty: 9800,  loaded: 31200, rate: 61, type: 'Credit' },
  { plate: 'UK07CA6023', material: '10MMCR', party: 'Singh Infra Projects', driver: 'Harpal',       place: 'Khatima',     empty: 11200, loaded: 40500, rate: 83, type: 'Credit' },
  { plate: 'UK04AB1192', material: 'DUST',   party: 'Cash',                 driver: 'Mohan',        place: 'Local',       empty: 8700,  loaded: 20900, rate: 55, type: 'Cash' },
  { plate: 'UP26T0517',  material: '20MMCR', party: 'Himalaya Builders',    driver: 'Sunil',        place: 'Rudrapur',    empty: 12300, loaded: 44100, rate: 84, type: 'Credit' },
  { plate: 'UK06CC8821', material: '6MMCR',  party: 'Sharma Constructions', driver: 'Deepak',       place: 'Haldwani',    empty: 10100, loaded: 39600, rate: 70, type: 'Credit' },
]
// Purchases: arrives loaded (entry), leaves empty (exit) -> exit < entry.
const purchases = [
  { plate: 'UK07CB3305', material: 'WMM',   party: 'Pahadi Suppliers',     driver: 'Naresh',   loaded: 38400, empty: 11800, rate: 45 },
  { plate: 'UK06CA9017', material: 'SAND',  party: 'Uttarakhand Aggregates', driver: 'Imran',  loaded: 29900, empty: 9900,  rate: 38 },
]

const materials = await api('/api/masters/materials')
const gst = (code) => materials.find((m) => m.code === code)?.gstRatePercent ?? 0

async function enter(v, weight) {
  const t = await api('/api/weighments/tokens', 'POST', {
    vehicleNumber: v.plate, materialCode: v.material, partyId: party(v.party), driverName: v.driver, place: v.place ?? null,
    manualWeight: weight, overrideReason: REASON,
  })
  if (!t.success) throw new Error('token: ' + JSON.stringify(t))
  return t.tokenId
}

for (const s of sales) {
  const id = await enter(s, s.empty)
  const ex = await api(`/api/weighments/tokens/${id}/exit`, 'POST', { manualWeight: s.loaded, overrideReason: REASON })
  if (ex.classification !== 'Sale') throw new Error('expected Sale, got ' + JSON.stringify(ex))
  const qty = (s.loaded - s.empty) / 100
  const taxable = round2(qty * s.rate)
  const tax = round2(taxable * gst(s.material) / 100)
  const net = taxable + tax
  const r = await api(`/api/weighments/tokens/${id}/sale`, 'POST', {
    tokenId: id, partyId: party(s.party), saleType: s.type, freight: 0, taxAmt: tax, kaantaCharge: 0, daala: 0, incentive: 0,
    roundOff: round2(Math.round(net) - net),
    lineItems: [{ materialCode: s.material, rate: s.rate, qty, discountRate: 0 }],
  })
  if (!r.success) throw new Error('sale: ' + JSON.stringify(r))
  console.log('sale', id, s.plate, qty + ' Qtl', '->', r.saleId)
}

for (const p of purchases) {
  const id = await enter(p, p.loaded)
  const ex = await api(`/api/weighments/tokens/${id}/exit`, 'POST', { manualWeight: p.empty, overrideReason: REASON })
  if (ex.classification !== 'Purchase') throw new Error('expected Purchase, got ' + JSON.stringify(ex))
  const r = await api(`/api/weighments/purchases/${ex.purchaseId}/complete`, 'POST', { rate: p.rate, less: 0 })
  if (r.success === false) throw new Error('purchase: ' + JSON.stringify(r))
  console.log('purchase', id, p.plate, '->', ex.purchaseId)
}

// One vehicle weighed out but not yet billed, and two still on the platform.
{
  const v = { plate: 'UK07CA5540', material: '40MMCR', party: 'Rudra Enterprises', driver: 'Gopal', place: 'Sitarganj' }
  const id = await enter(v, 10400)
  await api(`/api/weighments/tokens/${id}/exit`, 'POST', { manualWeight: 41800, overrideReason: REASON })
  console.log('awaiting billing', id, v.plate)
}
for (const v of [
  { plate: 'UK06CD2208', material: '20MMCR', party: 'Kailash Traders', driver: 'Satish', place: 'Kichha' },
  { plate: 'UK04AC7710', material: 'SAND', party: 'Negi Brothers', driver: 'Manoj', place: 'Local' },
]) {
  const id = await enter(v, 9600)
  console.log('open token', id, v.plate)
}
console.log('done')
