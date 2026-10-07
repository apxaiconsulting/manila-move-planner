import { formatPeso } from '../lib/format'

// Simple SVG donut: each segment's arc length is its share of the total.
export default function DonutChart({ segments, centerLabel, centerValue }) {
  const data = segments.filter((s) => s.value > 0)
  const total = data.reduce((a, s) => a + s.value, 0)
  const r = 60
  const c = 2 * Math.PI * r
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0" role="img" aria-label="Where the funds go">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#e7e5e4" strokeWidth="22" />
        {/* start segments at 12 o'clock */}
        <g transform="rotate(-90 80 80)">
          {total > 0 &&
            data.map((s) => {
              const len = (s.value / total) * c
              const el = (
                <circle
                  key={s.label}
                  cx="80"
                  cy="80"
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="22"
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-offset}
                >
                  <title>{`${s.label}: ${formatPeso(s.value)}`}</title>
                </circle>
              )
              offset += len
              return el
            })}
        </g>
        <text x="80" y="76" textAnchor="middle" className="fill-stone-500 text-[9px]">{centerLabel}</text>
        <text x="80" y="92" textAnchor="middle" className="fill-stone-900 text-[11px] font-semibold">{centerValue}</text>
      </svg>
      <ul className="w-full space-y-2 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-stone-600">
              <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="tabular-nums text-stone-900">
              {formatPeso(s.value)}
              <span className="ml-2 inline-block w-10 text-right text-xs text-stone-400">
                {total > 0 && s.value > 0 ? `${Math.round((s.value / total) * 100)}%` : '–'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
