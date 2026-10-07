# Manila Move-In Planner

Single-page planner for the Cebu → Makati move (arrival Jan 17, 2027).
React + Vite + Tailwind CSS v4. All data stays in your browser's localStorage. There is no backend.

## Run locally

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Structure

- `src/lib/calc.js`: all calculations (move-in scenarios, runway, gap cost, final leftover)
- `src/lib/defaults.js`: default numbers (also used by "Reset to defaults")
- `src/lib/summaryText.js`: plain-text output for "Copy summary"
- `src/components/`: one component per section, plus shared `ui.jsx`

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` builds the app and publishes it on every push to `main`.
One-time setup: in the repo, go to **Settings → Pages → Source** and choose **GitHub Actions**.
