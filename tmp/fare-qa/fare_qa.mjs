const BASE_URL = process.env.QA_BASE_URL ?? 'http://localhost:59273'

const routes = {
  riyadh: { lat: 24.7136, lng: 46.6753 },
  riyadhNorth: { lat: 24.8028, lng: 46.6390 },
  ruhAirport: { lat: 24.9576, lng: 46.6988 },
  dammam: { lat: 26.4207, lng: 50.0888 },
  khobar: { lat: 26.2172, lng: 50.1971 },
  jeddah: { lat: 21.4858, lng: 39.1925 },
  makkah: { lat: 21.3891, lng: 39.8579 },
  madinah: { lat: 24.5247, lng: 39.5692 },
  taif: { lat: 21.4373, lng: 40.5127 },
  ahsa: { lat: 25.3833, lng: 49.5867 },
  ula: { lat: 26.6085, lng: 37.9232 },
  alkharj: { lat: 24.1554, lng: 47.3346 },
  qasim: { lat: 26.3592, lng: 43.9818 },
}

const serviceExpected = {
  airport: {
    'First Class': { base: 550, vat: 82.5, total: 632.5 },
    'Business Premium': { base: 400, vat: 60, total: 460 },
    'Business Sedan': { base: 180, vat: 27, total: 207 },
    'Economy Sedan': { base: 120, vat: 18, total: 138 },
    SUV: { base: 280, vat: 42, total: 322, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 260, total 299.' },
    Van: { base: 180, vat: 27, total: 207 },
  },
  one_way: {
    'First Class': { base: 460, vat: 69, total: 529 },
    'Business Premium': { base: 380, vat: 57, total: 437 },
    'Business Sedan': { base: 135, vat: 20.25, total: 155.25 },
    'Economy Sedan': { base: 110, vat: 16.5, total: 126.5 },
    SUV: { base: 180, vat: 27, total: 207, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 170, total 195.5.' },
    Van: { base: 140, vat: 21, total: 161 },
  },
  hourly: {
    'First Class': { base: 650, vat: 97.5, total: 747.5 },
    'Business Premium': { base: 450, vat: 67.5, total: 517.5 },
    'Business Sedan': { base: 235, vat: 35.25, total: 270.25 },
    'Economy Sedan': { base: 190, vat: 28.5, total: 218.5 },
    SUV: { base: 370, vat: 55.5, total: 425.5, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 280, total 322.' },
    Van: { base: 190, vat: 28.5, total: 218.5 },
  },
  half_day: {
    'First Class': { base: 1230, vat: 184.5, total: 1414.5 },
    'Business Premium': { base: 760, vat: 114, total: 874 },
    'Business Sedan': { base: 640, vat: 96, total: 736 },
    'Economy Sedan': { base: 550, vat: 82.5, total: 632.5 },
    SUV: { base: 1100, vat: 165, total: 1265, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 1050, total 1207.5.' },
    Van: { base: 800, vat: 120, total: 920 },
  },
  full_day: {
    'First Class': { base: 2486, vat: 372.9, total: 2858.9 },
    'Business Premium': { base: 1498, vat: 224.7, total: 1722.7 },
    'Business Sedan': { base: 1250, vat: 187.5, total: 1437.5 },
    'Economy Sedan': { base: 950, vat: 142.5, total: 1092.5 },
    SUV: { base: 1650, vat: 247.5, total: 1897.5, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 1550, total 1782.5.' },
    Van: { base: 1200, vat: 180, total: 1380 },
  },
}

const cityToCityExpected = {
  dammam: {
    'Business Sedan': { base: 1150, vat: 172.5, total: 1322.5 },
    'Economy Sedan': { base: 950, vat: 142.5, total: 1092.5 },
    SUV: { base: 1450, vat: 217.5, total: 1667.5, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 1300, total 1495.' },
    Van: { base: 1050, vat: 157.5, total: 1207.5 },
  },
  khobar: {
    'Business Sedan': { base: 1175, vat: 176.25, total: 1351.25 },
    'Economy Sedan': { base: 975, vat: 146.25, total: 1121.25 },
    SUV: { base: 1475, vat: 221.25, total: 1696.25, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 1325, total 1523.75.' },
    Van: { base: 1075, vat: 161.25, total: 1236.25 },
  },
  jeddah: {
    'Business Sedan': { base: 2100, vat: 315, total: 2415 },
    'Economy Sedan': { base: 1750, vat: 262.5, total: 2012.5 },
    SUV: { base: 2550, vat: 382.5, total: 2932.5, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 2350, total 2702.5.' },
    Van: { base: 2150, vat: 322.5, total: 2472.5 },
  },
  makkah: {
    'Business Sedan': { base: 2050, vat: 307.5, total: 2357.5 },
    'Economy Sedan': { base: 1650, vat: 247.5, total: 1897.5 },
    SUV: { base: 2250, vat: 337.5, total: 2587.5, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 2150, total 2472.5.' },
    Van: { base: 2050, vat: 307.5, total: 2357.5 },
  },
  madinah: {
    'Business Sedan': { base: 2000, vat: 300, total: 2300 },
    'Economy Sedan': { base: 1600, vat: 240, total: 1840 },
    SUV: { base: 2150, vat: 322.5, total: 2472.5, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 2100, total 2415.' },
    Van: { base: 2000, vat: 300, total: 2300 },
  },
  taif: {
    'Business Sedan': { base: 2025, vat: 303.75, total: 2328.75 },
    'Economy Sedan': { base: 1650, vat: 247.5, total: 1897.5 },
    SUV: { base: 2175, vat: 326.25, total: 2501.25, note: 'Suburban / Yukon XL row. Tahoe / Yukon row expects base 2125, total 2443.75.' },
    Van: { base: 2050, vat: 307.5, total: 2357.5 },
  },
  ahsa: {
    'Business Sedan': { base: 1100, vat: 165, total: 1265 },
    'Economy Sedan': { base: 950, vat: 142.5, total: 1092.5 },
    SUV: { base: 1400, vat: 210, total: 1610, note: 'Tahoe / Yukon row expects base 1300, total 1495.' },
    Van: { base: 1100, vat: 165, total: 1265 },
  },
  ula: {
    'Business Sedan': { base: 2250, vat: 337.5, total: 2587.5 },
    'Economy Sedan': { base: 2050, vat: 307.5, total: 2357.5 },
    SUV: { base: 2900, vat: 435, total: 3335, note: 'Tahoe / Yukon row expects base 2850, total 3277.5.' },
    Van: { base: 2100, vat: 315, total: 2415 },
  },
  alkharj: {
    'Business Sedan': { base: 550, vat: 82.5, total: 632.5 },
    'Economy Sedan': { base: 490, vat: 73.5, total: 563.5 },
    SUV: { base: 650, vat: 97.5, total: 747.5, note: 'Tahoe / Yukon row expects base 600, total 690.' },
    Van: { base: 600, vat: 90, total: 690 },
  },
  qasim: {
    'Business Sedan': { base: 1150, vat: 172.5, total: 1322.5 },
    'Economy Sedan': { base: 950, vat: 142.5, total: 1092.5 },
    SUV: { base: 1350, vat: 202.5, total: 1552.5, note: 'Tahoe row expects base 1300, total 1495. GMC Yukon row also expects this Suburban / XL total.' },
    Van: { base: 1100, vat: 165, total: 1265 },
  },
}

function money(value) {
  if (value === undefined || value === null || value === '') return null
  const num = Number(value)
  return Number.isFinite(num) ? Math.round(num * 100) / 100 : null
}

function diff(actual, expected) {
  if (actual === null || expected === null || expected === undefined) return null
  return Math.round((actual - expected) * 100) / 100
}

function pass(actual, expected) {
  if (actual === null || expected === undefined) return false
  return Math.abs(actual - expected) < 0.01
}

async function getJson(path, init) {
  const res = await fetch(`${BASE_URL}${path}`, init)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${path} failed ${res.status}: ${JSON.stringify(json)}`)
  return json
}

async function calculate(body) {
  const json = await getJson('/api/fare/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return json.data ?? json
}

function row({ kind, service, route, className, expected, actual }) {
  const base = money(actual.base_fare)
  const vat = money(actual.vat_amount)
  const total = money(actual.total_fare)
  const item = {
    kind,
    service,
    route: route ?? '',
    className,
    expectedBase: expected.base,
    actualBase: base,
    baseDiff: diff(base, expected.base),
    expectedVat: expected.vat,
    actualVat: vat,
    vatDiff: diff(vat, expected.vat),
    expectedTotal: expected.total,
    actualTotal: total,
    totalDiff: diff(total, expected.total),
    pass: pass(base, expected.base) && pass(vat, expected.vat) && pass(total, expected.total),
    distanceKm: money(actual.distance_km),
    durationMinutes: money(actual.duration_minutes),
    note: expected.note ?? '',
  }
  return item
}

async function main() {
  const results = []

  for (const service of ['airport', 'one_way', 'hourly', 'half_day', 'full_day']) {
    const classes = await getJson(`/api/fleet/vehicle-classes?service_type=${service}`)
    for (const cls of classes) {
      const expected = serviceExpected[service]?.[cls.className]
      if (!expected) continue
      const body = {
        vehicle_class_id: cls.id,
        service_type: service,
        pickup_lat: service === 'airport' ? routes.ruhAirport.lat : routes.riyadh.lat,
        pickup_lng: service === 'airport' ? routes.ruhAirport.lng : routes.riyadh.lng,
      }
      if (service === 'airport') {
        body.dropoff_lat = routes.riyadh.lat
        body.dropoff_lng = routes.riyadh.lng
      } else if (service === 'one_way') {
        body.dropoff_lat = routes.riyadhNorth.lat
        body.dropoff_lng = routes.riyadhNorth.lng
      } else if (service === 'hourly') {
        body.duration_hours = 2
      }
      const actual = await calculate(body)
      results.push(row({ kind: 'standard', service, className: cls.className, expected, actual }))
    }
  }

  const c2cClasses = await getJson('/api/fleet/vehicle-classes?service_type=city_to_city')
  for (const [route, perClass] of Object.entries(cityToCityExpected)) {
    for (const cls of c2cClasses) {
      const expected = perClass[cls.className]
      if (!expected) continue
      const actual = await calculate({
        vehicle_class_id: cls.id,
        service_type: 'city_to_city',
        pickup_lat: routes.riyadh.lat,
        pickup_lng: routes.riyadh.lng,
        dropoff_lat: routes[route].lat,
        dropoff_lng: routes[route].lng,
      })
      results.push(row({ kind: 'city_to_city', service: 'city_to_city', route, className: cls.className, expected, actual }))
    }
  }

  const summary = {
    baseUrl: BASE_URL,
    total: results.length,
    passed: results.filter(item => item.pass).length,
    failed: results.filter(item => !item.pass).length,
  }
  console.log(JSON.stringify({ summary, results }, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
