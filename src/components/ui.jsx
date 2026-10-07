import { useEffect, useState } from 'react'

export function Card({ title, subtitle, action, children, id }) {
  return (
    <section id={id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

const parseNum = (text) => {
  const n = parseFloat(String(text).replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

// Text input that keeps what you type (e.g. "12017.") but reports a number upward.
export function NumberInput({ value, onChange, className = '', prefix, ...rest }) {
  const [text, setText] = useState(value ? String(value) : '')

  // Sync when the value changes from outside (reset, salary scenario switch)
  useEffect(() => {
    if (parseNum(text) !== (Number(value) || 0)) setText(value ? String(value) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className={`flex items-center rounded-lg border border-stone-300 bg-white focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 ${className}`}>
      {prefix && <span className="pl-3 text-sm text-stone-400">{prefix}</span>}
      <input
        type="text"
        inputMode="decimal"
        placeholder="0"
        value={text}
        onChange={(e) => {
          const t = e.target.value.replace(/[^\d.,]/g, '')
          setText(t)
          onChange(parseNum(t))
        }}
        className="w-full min-w-0 bg-transparent px-3 py-2 text-right text-sm tabular-nums outline-none"
        {...rest}
      />
    </div>
  )
}

export const MoneyInput = (props) => <NumberInput prefix="₱" {...props} />

export function TextInput({ value, onChange, className = '', ...rest }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2 py-2 text-sm hover:border-stone-200 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 ${className}`}
      {...rest}
    />
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-teal-600' : 'bg-stone-300'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-lg bg-stone-100 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${value === o.value ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export const STATUS_STYLES = {
  green: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-200', label: 'Above buffer' },
  yellow: { dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-200', label: 'Below buffer' },
  red: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', ring: 'ring-red-200', label: 'Short' },
}

export function StatusPill({ status }) {
  const s = STATUS_STYLES[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

export function IconButton({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"
    >
      {children}
    </button>
  )
}

export const TrashIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.44c-.8.08-1.58.18-2.37.3a.75.75 0 1 0 .22 1.49l.15-.02.84 10.52A2.75 2.75 0 0 0 7.58 19h4.84a2.75 2.75 0 0 0 2.74-2.52l.84-10.52.15.02a.75.75 0 0 0 .22-1.49c-.79-.12-1.58-.22-2.37-.3v-.44A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.67.03 2.5.08v-.33c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.33C8.33 4.03 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
  </svg>
)

export function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 rounded-lg border border-dashed border-stone-300 px-3 py-2 text-sm font-medium text-stone-600 hover:border-teal-600 hover:text-teal-700"
    >
      + {children}
    </button>
  )
}

export function TotalRow({ label, value, className = '' }) {
  return (
    <div className={`mt-3 flex items-center justify-between border-t border-stone-200 pt-3 ${className}`}>
      <span className="text-sm font-medium text-stone-600">{label}</span>
      <span className="text-base font-semibold tabular-nums text-stone-900">{value}</span>
    </div>
  )
}
