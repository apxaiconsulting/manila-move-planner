import { addDays, formatDate, parseDate } from '../lib/format'
import { Card } from './ui'

const EDITABLE = [
  { key: 'moveOut', label: 'Move out of Cebu' },
  { key: 'novSalary', label: 'November salary' },
  { key: 'decSalary', label: 'December salary' },
  { key: 'usTrip', label: 'US trip' },
  { key: 'arrival', label: 'Arrive in Manila (Makati)' },
  { key: 'firstRentDue', label: 'First rent due' },
]

export default function Timeline({ plan, update }) {
  const t = plan.timeline
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Next paycheck is derived: arrival date + the gap days from the budget section.
  const events = [
    ...EDITABLE.map((e) => ({ ...e, date: t[e.key], editable: true })),
    { key: 'paycheck', label: 'First Manila paycheck (arrival + gap days)', date: addDays(t.arrival, plan.gapDays) },
  ].sort((a, b) => {
    // undated events (e.g. US trip TBD) go last
    const ta = parseDate(a.date)?.getTime() ?? Infinity
    const tb = parseDate(b.date)?.getTime() ?? Infinity
    return ta === tb ? 0 : ta - tb
  })

  const setDate = (key, value) => update((p) => ({ ...p, timeline: { ...p.timeline, [key]: value } }))

  return (
    <Card id="timeline" title="Timeline" subtitle="Dates are editable. Events sort themselves.">
      <ol className="relative ml-2 border-l-2 border-stone-200">
        {events.map((e) => {
          const d = parseDate(e.date)
          const days = d ? Math.round((d - today) / 86400000) : null
          const past = days !== null && days < 0
          return (
            <li key={e.key} className="relative pb-5 pl-6 last:pb-0">
              <span
                className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white ${past ? 'bg-stone-300' : e.key === 'arrival' ? 'bg-teal-600' : 'bg-teal-400'}`}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className={`text-sm font-medium ${past ? 'text-stone-400' : 'text-stone-900'}`}>{e.label}</p>
                  <p className="text-xs text-stone-500">
                    {formatDate(e.date)}
                    {days !== null && (
                      <span className="ml-2">
                        {days === 0 ? '· today' : past ? `· ${-days} days ago` : `· in ${days} days`}
                      </span>
                    )}
                  </p>
                </div>
                {e.editable && (
                  <input
                    type="date"
                    value={e.date}
                    onChange={(ev) => setDate(e.key, ev.target.value)}
                    className="rounded-lg border border-stone-300 px-2 py-1 text-sm focus:border-teal-600 focus:outline-none"
                    aria-label={`${e.label} date`}
                  />
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
