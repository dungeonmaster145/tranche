# Roadmap

## v1.0 — current
Web app, manual closing-level entry, simulation mode, localStorage persistence,
configurable tranche splits, remittance threshold tracker. Zero backend.

## v1.1 — hardening
- Unit tests for `src/lib/algorithm.js` (Vitest) — the pure core makes this trivial
- Pluggable market-data providers behind a `getReading()` interface in
  `src/lib/market.js`: manual (default), plus optional adapters for any
  quotes API the user configures with their own key. Closing levels only.
- Multiple plans (e.g., a maturing insurance payout as a second D)
- Export/import state as JSON (backup before clearing a browser)
- Currency/locale presets beyond INR

## v2.0 — mobile (Play Store / App Store)
Two viable paths, in order of effort:

1. **Capacitor wrap (recommended first)** — the existing web app ships
   inside a native shell with minimal changes. Swap `storage.js` for
   Capacitor Preferences. Local scheduled notifications ("record today's
   reading", backstop-date reminders) work on-device without any server.
2. **React Native rewrite** — only if native UI becomes necessary.
   `algorithm.js` ports unchanged; that is why it is pure.

True push alerts on trigger levels ("the market closed below −10%") require
either a small backend that watches closes, or — more honestly — the user's
broker price alerts, which already exist and are free. v2 ships with local
reminders and keeps broker alerts as the real-time layer.

## Non-goals, permanently
- Predicting markets
- Telling anyone "the best time"
- Trading integrations that execute automatically — a human marks every
  deployment by design; friction at the moment of execution is a feature
