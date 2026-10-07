// All money math is done in whole centavos, then converted back to pesos,
// so sums like 12,017.58 + 38,000 never pick up floating-point noise.
const toCents = (n) => Math.round((Number(n) || 0) * 100)
const fromCents = (c) => c / 100
const sum = (amounts) => fromCents(amounts.reduce((acc, n) => acc + toCents(n), 0))
const round2 = (n) => fromCents(toCents(n))

export const SCENARIOS = [
  { id: '1+2', label: '1 advance + 2 deposit', advance: 1, deposit: 2 },
  { id: '2+2', label: '2 advance + 2 deposit', advance: 2, deposit: 2 },
  { id: 'custom', label: 'Custom' },
]

// green = at or above buffer target, yellow = positive but under buffer, red = short
export function statusFor(amount, buffer) {
  if (amount < 0) return 'red'
  if (amount >= (Number(buffer) || 0)) return 'green'
  return 'yellow'
}

export function computePlan(plan) {
  const rent = Number(plan.rent) || 0

  // 1. Total of every fund source that is toggled "included"
  const totalFunds = sum(plan.funds.filter((f) => f.included).map((f) => f.amount))

  // 2. Move-in cost per scenario = rent × (months advance + months deposit)
  const scenarios = SCENARIOS.map((s) => {
    const advance = s.id === 'custom' ? Number(plan.customAdvance) || 0 : s.advance
    const deposit = s.id === 'custom' ? Number(plan.customDeposit) || 0 : s.deposit
    const moveIn = round2(rent * (advance + deposit))
    const remaining = round2(totalFunds - moveIn)
    return { ...s, advance, deposit, moveIn, remaining, status: statusFor(remaining, plan.bufferTarget) }
  })
  const selected = scenarios.find((s) => s.id === plan.selectedScenario) ?? scenarios[0]

  // 3. Monthly budget = rent + every other budget line
  const otherMonthly = sum(plan.budget.map((b) => b.amount))
  const monthlyExpenses = round2(rent + otherMonthly)

  // 4. One-time setup costs: only checked items count
  const oneTime = sum(plan.oneTime.filter((o) => o.checked).map((o) => o.amount))

  // 5. Gap between arrival and first paycheck, prorated on a 30-day month.
  //    If the scenario pays at least 1 month advance, that month's rent is already
  //    covered by the move-in cost, so the gap only needs the non-rent expenses.
  const rentCoveredByAdvance = selected.advance >= 1
  const gapMonthlyBurn = rentCoveredByAdvance ? otherMonthly : monthlyExpenses
  const gapCost = round2((gapMonthlyBurn * (Number(plan.gapDays) || 0)) / 30)

  // 6. Runway = months of full monthly expenses the money left after
  //    move-in and one-time costs can pay for.
  const afterSetup = round2(selected.remaining - oneTime)
  const runwayMonths = monthlyExpenses > 0 ? Math.max(afterSetup, 0) / monthlyExpenses : 0

  // 7. Final leftover = funds − move-in − one-time − gap reserve
  const finalLeftover = round2(totalFunds - selected.moveIn - oneTime - gapCost)

  return {
    rent,
    totalFunds,
    scenarios,
    selected,
    otherMonthly,
    monthlyExpenses,
    oneTime,
    rentCoveredByAdvance,
    gapCost,
    afterSetup,
    runwayMonths,
    finalLeftover,
    finalStatus: statusFor(finalLeftover, plan.bufferTarget),
  }
}
