import { formatDate, formatPeso, newId } from '../lib/format'
import { AddButton, Card, IconButton, MoneyInput, NumberInput, TextInput, TotalRow, TrashIcon } from './ui'

export default function Budget({ plan, update, result }) {
  const setBudget = (fn) => update((p) => ({ ...p, budget: fn(p.budget) }))
  const editRow = (id, patch) => setBudget((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const runway = result.runwayMonths

  return (
    <Card id="budget" title="Post-move monthly budget" subtitle="What life in Makati costs per month.">
      <ul className="divide-y divide-stone-100">
        {/* Rent is shared with the move-in calculator so the two never disagree */}
        <li className="flex items-center gap-2 py-2">
          <span className="flex-1 px-2 text-sm">
            Rent <span className="text-xs text-stone-400">(from move-in calculator)</span>
          </span>
          <MoneyInput value={plan.rent} onChange={(v) => update((p) => ({ ...p, rent: v }))} className="w-40" aria-label="Rent" />
          <span className="w-8" />
        </li>
        {plan.budget.map((row) => (
          <li key={row.id} className="flex items-center gap-2 py-2">
            <TextInput value={row.label} onChange={(v) => editRow(row.id, { label: v })} className="flex-1" aria-label="Label" />
            <MoneyInput value={row.amount} onChange={(v) => editRow(row.id, { amount: v })} className="w-40" aria-label={`${row.label} amount`} />
            <IconButton label={`Delete ${row.label}`} onClick={() => setBudget((rows) => rows.filter((r) => r.id !== row.id))}>
              <TrashIcon />
            </IconButton>
          </li>
        ))}
      </ul>
      <AddButton onClick={() => setBudget((rows) => [...rows, { id: newId(), label: 'New expense', amount: 0 }])}>
        Add expense
      </AddButton>
      <TotalRow label="Total monthly expenses" value={formatPeso(result.monthlyExpenses)} />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-stone-50 p-4">
          <h3 className="text-sm font-semibold text-stone-700">Runway</h3>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-stone-900">
            {runway.toFixed(1)} <span className="text-base font-normal text-stone-500">months</span>
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {formatPeso(result.afterSetup)} left after move-in ({formatPeso(result.selected.moveIn)}) and one-time costs (
            {formatPeso(result.oneTime)}) ÷ {formatPeso(result.monthlyExpenses)} per month.
          </p>
        </div>

        <div className="rounded-xl bg-stone-50 p-4">
          <h3 className="text-sm font-semibold text-stone-700">Gap until first Manila paycheck</h3>
          <div className="mt-2 flex items-center gap-2">
            <NumberInput
              value={plan.gapDays}
              onChange={(v) => update((p) => ({ ...p, gapDays: v }))}
              className="w-24"
              aria-label="Days until next paycheck"
            />
            <span className="text-sm text-stone-500">days after arriving {formatDate(plan.timeline.arrival)}</span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900">{formatPeso(result.gapCost)}</p>
          <p className="mt-1 text-xs text-stone-500">
            {result.rentCoveredByAdvance
              ? `Non-rent expenses (${formatPeso(result.otherMonthly)}/mo) × ${plan.gapDays || 0} ÷ 30 days. First month's rent is already paid as advance.`
              : `Full expenses (${formatPeso(result.monthlyExpenses)}/mo) × ${plan.gapDays || 0} ÷ 30 days. No advance rent in this scenario.`}
          </p>
        </div>
      </div>
    </Card>
  )
}
