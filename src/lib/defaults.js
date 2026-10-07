// Starting plan. Fund amounts start blank because this repo is public;
// real numbers are entered in the browser and kept in localStorage.
// Everything the user edits lives in this one object,
// which is persisted to localStorage as-is.
export const SALARY_PRESETS = { '100k': 100000, '80k': 80000 }

export const ARRIVAL_DATE = '2027-01-17'

export function defaultPlan() {
  return {
    funds: [
      { id: 'f1', label: 'Current move-in fund', amount: 0, included: true },
      { id: 'f2', label: 'Cebu condo deposit refund', amount: 0, included: true },
      { id: 'f3', label: 'Leftover peso spending/travel fund', amount: 0, included: true },
      { id: 'f4', label: 'November salary', amount: 0, included: true, salary: 'nov' },
      { id: 'f5', label: 'December salary', amount: 0, included: true, salary: 'dec' },
      { id: 'f6', label: 'Leftover USD converted to PHP', amount: 0, included: true },
    ],
    salaryScenario: 'custom', // '100k' | '80k' | 'custom'
    customSalary: { nov: 0, dec: 0 },

    rent: 30000,
    customAdvance: 1,
    customDeposit: 1,
    selectedScenario: '1+2', // '1+2' | '2+2' | 'custom'
    bufferTarget: 50000, // remaining funds you want left over, drives green/yellow/red

    // Rent is not listed here: the budget always uses the monthly rent above.
    budget: [
      { id: 'b1', label: 'Utilities', amount: 10000 },
      { id: 'b2', label: 'Living expenses', amount: 40000 },
    ],
    gapDays: 30,

    oneTime: [
      { id: 'o1', label: 'Movers / transport from Cebu or airfreight', amount: 0, checked: true },
      { id: 'o2', label: 'Furniture', amount: 0, checked: true },
      { id: 'o3', label: 'Appliances', amount: 0, checked: true },
      { id: 'o4', label: 'Bedding and linens', amount: 0, checked: true },
      { id: 'o5', label: 'Kitchen essentials', amount: 0, checked: true },
      { id: 'o6', label: 'Internet installation', amount: 0, checked: true },
      { id: 'o7', label: 'Miscellaneous', amount: 0, checked: true },
    ],

    timeline: {
      moveOut: '2026-10-09',
      novSalary: '2026-11-30',
      decSalary: '2026-12-31',
      usTrip: '',
      arrival: ARRIVAL_DATE,
      firstRentDue: '2027-02-17',
    },
  }
}
