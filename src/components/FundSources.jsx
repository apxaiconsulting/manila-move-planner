import { formatPeso, newId } from '../lib/format'
import { SALARY_PRESETS } from '../lib/defaults'
import { AddButton, Card, IconButton, MoneyInput, Segmented, TextInput, Toggle, TotalRow, TrashIcon } from './ui'

export default function FundSources({ plan, update, totalFunds }) {
  const setFunds = (fn) => update((p) => ({ ...p, funds: fn(p.funds) }))
  const editRow = (id, patch) => setFunds((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  // Switching scenario rewrites the amounts of the rows tagged as Nov/Dec salary.
  const setSalaryScenario = (scenario) =>
    update((p) => ({
      ...p,
      salaryScenario: scenario,
      funds: p.funds.map((r) =>
        r.salary ? { ...r, amount: SALARY_PRESETS[scenario] ?? p.customSalary[r.salary] } : r,
      ),
    }))

  // Editing a salary row by hand (or in custom mode) makes it the custom amount.
  const setSalaryAmount = (row, amount) =>
    update((p) => ({
      ...p,
      salaryScenario: 'custom',
      customSalary: { ...p.customSalary, [row.salary]: amount },
      funds: p.funds.map((r) => (r.id === row.id ? { ...r, amount } : r)),
    }))

  return (
    <Card
      id="funds"
      title="Fund sources"
      subtitle="Toggle a row off to leave it out of the total."
      action={
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-400">Salary scenario</span>
          <Segmented
            value={plan.salaryScenario}
            onChange={setSalaryScenario}
            options={[
              { value: '100k', label: '₱100k' },
              { value: '80k', label: '₱80k' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
        </div>
      }
    >
      <ul className="divide-y divide-stone-100">
        {plan.funds.map((row) => (
          <li key={row.id} className={`flex flex-wrap items-center gap-2 py-2 sm:flex-nowrap ${row.included ? '' : 'opacity-50'}`}>
            <Toggle checked={row.included} onChange={(v) => editRow(row.id, { included: v })} label={`Include ${row.label}`} />
            <TextInput value={row.label} onChange={(v) => editRow(row.id, { label: v })} className="flex-1 basis-40" aria-label="Label" />
            {row.salary && (
              <span className="rounded bg-teal-50 px-1.5 py-0.5 text-xs font-medium text-teal-700">salary</span>
            )}
            <MoneyInput
              value={row.amount}
              onChange={(v) => (row.salary ? setSalaryAmount(row, v) : editRow(row.id, { amount: v }))}
              className="ml-auto w-40"
              aria-label={`${row.label} amount`}
            />
            <IconButton label={`Delete ${row.label}`} onClick={() => setFunds((rows) => rows.filter((r) => r.id !== row.id))}>
              <TrashIcon />
            </IconButton>
          </li>
        ))}
      </ul>
      <AddButton onClick={() => setFunds((rows) => [...rows, { id: newId(), label: 'New source', amount: 0, included: true }])}>
        Add fund source
      </AddButton>
      <TotalRow label="Total included funds" value={formatPeso(totalFunds)} />
    </Card>
  )
}
