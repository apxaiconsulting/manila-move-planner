import { formatPeso } from '../lib/format'
import { STATUS_STYLES } from './ui'
import DonutChart from './DonutChart'

export default function Summary({ result }) {
  const status = STATUS_STYLES[result.finalStatus]
  const shortfall = result.finalLeftover < 0

  const stats = [
    { label: 'Total funds', value: result.totalFunds },
    { label: `Move-in (${result.selected.label})`, value: result.selected.moveIn },
    { label: 'One-time costs', value: result.oneTime },
    { label: 'Gap / living reserve', value: result.gapCost },
  ]

  return (
    <section className="grid gap-4 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-3">
        <div className={`rounded-2xl p-5 ring-1 sm:p-6 ${status.bg} ${status.ring}`}>
          <p className={`text-sm font-medium ${status.text}`}>Final leftover</p>
          <p className={`mt-1 text-4xl font-bold tabular-nums tracking-tight sm:text-5xl ${status.text}`}>
            {formatPeso(result.finalLeftover)}
          </p>
          <p className="mt-2 text-sm text-stone-600">
            {shortfall
              ? 'Your plan is short. Trim one-time costs, choose a smaller move-in scenario, or add funds.'
              : result.finalStatus === 'yellow'
                ? 'Positive, but below your buffer target.'
                : 'Comfortably above your buffer target.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-stone-200 bg-white p-3 sm:p-4">
              <p className="truncate text-xs text-stone-500" title={s.label}>{s.label}</p>
              <p className="mt-1 text-base font-semibold tabular-nums text-stone-900 sm:text-lg">{formatPeso(s.value)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-6 lg:col-span-2">
        <h2 className="mb-4 text-sm font-semibold text-stone-700">Where the funds go</h2>
        <DonutChart
          centerLabel="Total funds"
          centerValue={formatPeso(result.totalFunds)}
          segments={[
            { label: 'Move-in cost', value: result.selected.moveIn, color: '#0f766e' },
            { label: 'One-time costs', value: result.oneTime, color: '#f59e0b' },
            { label: 'Gap reserve', value: result.gapCost, color: '#0ea5e9' },
            { label: shortfall ? 'Shortfall' : 'Leftover', value: Math.abs(result.finalLeftover), color: shortfall ? '#ef4444' : '#10b981' },
          ]}
        />
      </div>
    </section>
  )
}
