import { formatDate, formatPeso } from './format'

// Plain-text version of the plan for the "Copy summary" button.
export function buildSummaryText(plan, r) {
  const line = (label, value) => `  ${label}: ${value}`
  const t = plan.timeline
  return [
    'MANILA MOVE-IN PLAN',
    `Arrival in Makati: ${formatDate(t.arrival)}`,
    '',
    'FUNDS',
    ...plan.funds.filter((f) => f.included).map((f) => line(f.label, formatPeso(f.amount))),
    line('Total funds', formatPeso(r.totalFunds)),
    '',
    `MOVE-IN (rent ${formatPeso(r.rent)}/mo)`,
    ...r.scenarios.map((s) =>
      line(`${s.label}${s.id === r.selected.id ? ' [selected]' : ''}`, `${formatPeso(s.moveIn)} → ${formatPeso(s.remaining)} remaining`),
    ),
    '',
    'MONTHLY BUDGET',
    line('Rent', formatPeso(r.rent)),
    ...plan.budget.map((b) => line(b.label, formatPeso(b.amount))),
    line('Total per month', formatPeso(r.monthlyExpenses)),
    '',
    'ONE-TIME COSTS (checked)',
    ...plan.oneTime.filter((o) => o.checked && o.amount > 0).map((o) => line(o.label, formatPeso(o.amount))),
    line('Total', formatPeso(r.oneTime)),
    '',
    'SUMMARY',
    line('Total funds', formatPeso(r.totalFunds)),
    line(`Move-in (${r.selected.label})`, formatPeso(r.selected.moveIn)),
    line('One-time costs', formatPeso(r.oneTime)),
    line(`Gap reserve (${plan.gapDays} days to first paycheck)`, formatPeso(r.gapCost)),
    line('FINAL LEFTOVER', formatPeso(r.finalLeftover)),
    line('Runway after setup', `${r.runwayMonths.toFixed(1)} months`),
    '',
    'TIMELINE',
    line('Move out of Cebu', formatDate(t.moveOut)),
    line('November salary', formatDate(t.novSalary)),
    line('December salary', formatDate(t.decSalary)),
    line('US trip', formatDate(t.usTrip)),
    line('Arrive in Manila', formatDate(t.arrival)),
    line('First rent due', formatDate(t.firstRentDue)),
  ].join('\n')
}
