import { formatPeso, newId } from '../lib/format'
import { AddButton, Card, IconButton, MoneyInput, TextInput, TotalRow, TrashIcon } from './ui'

export default function OneTimeCosts({ plan, update, result }) {
  const setItems = (fn) => update((p) => ({ ...p, oneTime: fn(p.oneTime) }))
  const editRow = (id, patch) => setItems((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  return (
    <Card id="one-time" title="One-time setup costs" subtitle="Only checked items are counted.">
      <ul className="divide-y divide-stone-100">
        {plan.oneTime.map((row) => (
          <li key={row.id} className={`flex items-center gap-2 py-2 ${row.checked ? '' : 'opacity-50'}`}>
            <input
              type="checkbox"
              checked={row.checked}
              onChange={(e) => editRow(row.id, { checked: e.target.checked })}
              className="h-4 w-4 shrink-0 accent-teal-600"
              aria-label={`Count ${row.label}`}
            />
            <TextInput value={row.label} onChange={(v) => editRow(row.id, { label: v })} className="flex-1" aria-label="Item" />
            <MoneyInput value={row.amount} onChange={(v) => editRow(row.id, { amount: v })} className="w-36 sm:w-40" aria-label={`${row.label} estimate`} />
            <IconButton label={`Delete ${row.label}`} onClick={() => setItems((rows) => rows.filter((r) => r.id !== row.id))}>
              <TrashIcon />
            </IconButton>
          </li>
        ))}
      </ul>
      <AddButton onClick={() => setItems((rows) => [...rows, { id: newId(), label: 'New item', amount: 0, checked: true }])}>
        Add item
      </AddButton>
      <TotalRow label="Checked items total" value={formatPeso(result.oneTime)} />
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-stone-500">Remaining after move-in − one-time costs</span>
        <span className={`font-semibold tabular-nums ${result.afterSetup < 0 ? 'text-red-600' : 'text-stone-900'}`}>
          {formatPeso(result.afterSetup)}
        </span>
      </div>
    </Card>
  )
}
