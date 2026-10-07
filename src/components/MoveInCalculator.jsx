import { formatPeso } from '../lib/format'
import { Card, MoneyInput, NumberInput, STATUS_STYLES, StatusPill } from './ui'

export default function MoveInCalculator({ plan, update, result }) {
  const set = (key) => (v) => update((p) => ({ ...p, [key]: v }))

  return (
    <Card
      id="move-in"
      title="Move-in cost calculator"
      subtitle="Move-in cost = monthly rent × (months advance + months deposit). Tap a scenario to use it in the summary."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Monthly rent">
          <MoneyInput value={plan.rent} onChange={set('rent')} />
        </Field>
        <Field label="Custom: months advance">
          <NumberInput value={plan.customAdvance} onChange={set('customAdvance')} />
        </Field>
        <Field label="Custom: months deposit">
          <NumberInput value={plan.customDeposit} onChange={set('customDeposit')} />
        </Field>
        <Field label="Buffer target">
          <MoneyInput value={plan.bufferTarget} onChange={set('bufferTarget')} />
        </Field>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {result.scenarios.map((s) => {
          const selected = s.id === plan.selectedScenario
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => set('selectedScenario')(s.id)}
              aria-pressed={selected}
              className={`rounded-xl border p-4 text-left transition ${selected ? 'border-teal-600 ring-2 ring-teal-600/20' : 'border-stone-200 hover:border-stone-300'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-stone-900">{s.label}</span>
                {selected && <span className="text-xs font-semibold uppercase text-teal-700">Selected</span>}
              </div>
              <p className="mt-0.5 text-xs text-stone-500">
                {s.advance} adv + {s.deposit} dep = {s.advance + s.deposit} month{s.advance + s.deposit === 1 ? '' : 's'} of rent
              </p>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-stone-500">Move-in cost</dt>
                  <dd className="font-medium tabular-nums">{formatPeso(s.moveIn)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-stone-500">Remaining funds</dt>
                  <dd className={`font-semibold tabular-nums ${STATUS_STYLES[s.status].text}`}>{formatPeso(s.remaining)}</dd>
                </div>
              </dl>
              <div className="mt-3">
                <StatusPill status={s.status} />
              </div>
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-stone-500">
        Green: remaining ≥ buffer target ({formatPeso(plan.bufferTarget)}). Yellow: positive but under buffer. Red: not enough funds.
      </p>
    </Card>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-stone-500">{label}</span>
      {children}
    </label>
  )
}
