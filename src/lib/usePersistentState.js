import { useEffect, useState } from 'react'

// useState that loads from / saves to localStorage. Saved data is merged over the
// defaults so new fields added in later versions still get a value.
export function usePersistentState(key, makeDefault) {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key))
      if (saved && typeof saved === 'object') {
        const base = makeDefault()
        return { ...base, ...saved, timeline: { ...base.timeline, ...saved.timeline } }
      }
    } catch {
      // ignore unreadable storage and fall back to defaults
    }
    return makeDefault()
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // storage full or blocked (private mode): the app still works, it just won't persist
    }
  }, [key, state])

  return [state, setState]
}
