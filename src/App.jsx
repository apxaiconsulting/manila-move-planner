import { useMemo, useState } from 'react'
import { defaultPlan } from './lib/defaults'
import { computePlan } from './lib/calc'
import { buildSummaryText } from './lib/summaryText'
import { usePersistentState } from './lib/usePersistentState'
import Summary from './components/Summary'
import FundSources from './components/FundSources'
import MoveInCalculator from './components/MoveInCalculator'
import Budget from './components/Budget'
import OneTimeCosts from './components/OneTimeCosts'
import Timeline from './components/Timeline'

const STORAGE_KEY = 'manila-move-planner:v1'

export default function App() {
  const [plan, setPlan] = usePersistentState(STORAGE_KEY, defaultPlan)
  const [copied, setCopied] = useState(false)

  // Every number on the page is derived from `plan` here, so edits recalc live.
  const result = useMemo(() => computePlan(plan), [plan])

  const reset = () => {
    if (window.confirm('Reset everything to the default numbers? Your edits will be lost.')) setPlan(defaultPlan())
  }

  const copySummary = async () => {
    const text = buildSummaryText(plan, result)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for browsers that block the async clipboard API
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold sm:text-xl">Manila Move-In Planner</h1>
            <p className="text-xs text-stone-500">Cebu → Makati · saved in this browser</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Reset to defaults
            </button>
            <button
              type="button"
              onClick={copySummary}
              className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              {copied ? 'Copied ✓' : 'Copy summary'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <Summary result={result} />
        <FundSources plan={plan} update={setPlan} totalFunds={result.totalFunds} />
        <MoveInCalculator plan={plan} update={setPlan} result={result} />
        <Budget plan={plan} update={setPlan} result={result} />
        <OneTimeCosts plan={plan} update={setPlan} result={result} />
        <Timeline plan={plan} update={setPlan} />
      </main>

      <footer className="pb-8 text-center text-xs text-stone-400">All data stays on this device (localStorage).</footer>
    </div>
  )
}
