// Exact peso amounts with thousands separators and centavos, e.g. ₱12,017.58
const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatPeso = (n) => peso.format(Number(n) || 0)

// 'YYYY-MM-DD' -> local Date (avoids the UTC off-by-one from new Date('YYYY-MM-DD'))
export function parseDate(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(iso, days) {
  const d = parseDate(iso)
  if (!d) return ''
  d.setDate(d.getDate() + (Number(days) || 0))
  return toISODate(d)
}

export function formatDate(iso) {
  const d = parseDate(iso)
  if (!d) return 'Date TBD'
  return d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
