# Tranche

**A rules-based lump-sum deployment system. Decide once, in calm. Execute mechanically, in chaos.**

Every investor sitting on cash asks the same question: *is now the right time to invest it?* Tranche exists because the honest answer is that nobody knows — and because there is a better question.

---

## The niche (read this before the code)

There is no shortage of tools that claim to time the market. Tranche is the opposite kind of tool. It is built on three findings from decades of market history:

**1. Nobody reliably calls bottoms.** Not analysts, not quant funds, not AI. Any tool promising to alert you at "the perfect time" is selling astrology with a dashboard.

**2. Waiting is usually the expensive mistake.** Research on lump-sum investing (Vanguard's studies are the best known) finds that deploying immediately beats waiting for a dip roughly two times out of three, because markets rise more often than they fall. Cash waiting for the perfect entry typically watches prices run away from it — and the long-awaited dip often arrives at levels *above* where the waiting began.

**3. The only dependable edge is behavioral.** Investors don't underperform because they pick the wrong day; they underperform because fear and greed renegotiate their plans in real time. A pre-committed rule system — written while calm, executed mechanically while markets scream — is the one edge that reliably exists.

So Tranche refuses to predict. Instead, it helps you:

- **Compute your true deployable surplus (D)** — after walling off an emergency floor, 12-month obligations, and money earmarked for life plans. If D ≤ 0, the tool refuses to run. That refusal *is* the system working.
- **Split D into tranches** — by default 40% deploys immediately (respecting the statistics), and three slices of 20% wait at −5%, −10%, and −15% drawdowns from the all-time closing high.
- **Enforce time backstops** — any tranche not triggered within 6 / 9 / 12 months deploys anyway. The backstop is what makes the system honest: the market owes you nothing, including a correction.
- **Show you the market against your rules** — a drawdown gauge places the latest close on a ruled scale with your trigger marks. When a tranche fires, the ledger tells you. Nothing else does.
- **Stress-test before it matters** — simulation mode lets you drag a fake crash and watch your tranches respond, so the first time you see a trigger fire is a fire drill, not a panic.
- **Track remittance thresholds** — for investors deploying cross-border (built with India's LRS/TCS ₹10 lakh threshold as the default; configurable or hideable).

What Tranche will *not* do: beat simple immediate investing most of the time (it won't, and says so on the tin), predict anything, or let you quietly bend your own rules at 2am during a selloff.

## Screenshots

*(Add after first deploy: onboarding, the gauge, a fired tranche.)*

## Quick start

```bash
git clone https://github.com/<you>/tranche.git
cd tranche
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

No backend, no accounts, no API keys. All state lives in your browser's localStorage and never leaves your machine.

**To put it online**, see [docs/DEPLOY.md](docs/DEPLOY.md) — one-click configs for Vercel, Netlify, Cloudflare Pages, and a ready GitHub Pages workflow are included, plus the Capacitor path to the app stores.

## How to use it

1. **Read the onboarding.** Four short steps. The third one is interactive — drag the market down and watch the mechanism before trusting it with real numbers.
2. **Compute D.** Enter total liquid cash, your emergency floor (3–6 months of expenses — untouchable), obligations due within 12 months, and anything earmarked for plans within ~3 years. Only what clears all four gates is deployable.
3. **Lock the plan.** Defaults are 40/20/20/20 at −5/−10/−15%; adjust in the advanced panel *now, in calm* — the house rule is that splits are never changed mid-drawdown.
4. **Record readings.** Once a day or whenever you like, enter the index's latest **closing** level and all-time closing high (any finance site has both). Closing levels only — intraday touches don't fire triggers. The gauge and ledger update; fired tranches demand action.
5. **Mark deployments.** When you execute a tranche with your broker, mark it deployed. The ledger remembers.

Manual entry in v1 is a feature, not a gap: the 30-second daily lookup is the ritual, and it keeps the tool free of keys, rate limits, and servers. Auto-fetch is on the roadmap as a pluggable provider.

## Architecture

```
src/
  lib/
    algorithm.js   # ALL financial logic — pure, deterministic, testable
    storage.js     # persistence adapter (localStorage today; swap for
                   # AsyncStorage/Capacitor Preferences on mobile)
  components/
    Onboarding.jsx        # interactive philosophy explainer
    SurplusCalculator.jsx # Step 1: compute D, configure tranches
    DrawdownGauge.jsx     # the signature visual
    MarketCheck.jsx       # manual readings + simulation mode
    TrancheBoard.jsx      # the ledger rows + deploy actions
    RemitTracker.jsx      # LRS/TCS threshold meter
  App.jsx          # state wiring
docs/
  ALGORITHM.md     # the full rule specification (v1.0)
  ROADMAP.md       # path to data providers, tests, and mobile stores
```

The separation is deliberate: `algorithm.js` has no UI, no storage, and no network, so the rules can be read, audited, and unit-tested by anyone before they trust them — and reused unchanged in a mobile build.

## The full rule specification

See [docs/ALGORITHM.md](docs/ALGORITHM.md) — including the anti-rules, which matter more than the rules.

## Disclaimer

Tranche is educational software that executes rules **you** write. It is not financial, investment, tax, or legal advice; its authors are not advisors; markets can and will behave worse than any backtest. Tax thresholds (e.g., India's LRS/TCS rules) change with government budgets — verify current values before acting. You are the only person responsible for your money.

## License

MIT © 2026 Mayank Joshi
