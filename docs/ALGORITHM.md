# Lump-Sum Deployment Algorithm — v1.0

Owner: Mayank | Drafted: 10 June 2026 | Review: once per year, never during a drawdown

This document is the complete rule set for deploying lump-sum capital. Its purpose is to remove in-the-moment judgment from deployment decisions. The rules below were written by calm-you. Scared-you and greedy-you do not get to renegotiate them. Discussion and analysis happen with Claude; execution happens only per these rules.

---

## Step 1 — Compute deployable surplus (D)

Before any market consideration, compute D. Only D enters the algorithm.

D = Total liquid cash
  − Emergency fund floor (6 months of expenses ≈ ₹6,00,000)
  − All committed obligations due within the next 12 months (e.g., remaining land instalments)
  − Any money with a known purpose inside 3 years (trip, purchase, family commitment)

If D ≤ 0, the algorithm does not run. There is no lump sum. Stop here.

The emergency floor and obligation money live in sweep-in FDs or liquid funds. They are not investment capital under any market condition, including a crash that "looks like a generational opportunity."

## Step 2 — Reference levels

All triggers are measured as percentage drawdown from the S&P 500's all-time closing high (ATH). On the date of drafting, ATH ≈ 7,600 (verify and update in your broker app). Trigger levels are recomputed whenever a new ATH is set — the levels ratchet upward with the market.

Current trigger levels (update when ATH changes):
- T1 level: 5% below ATH ≈ 7,220
- T2 level: 10% below ATH ≈ 6,840
- T3 level: 15% below ATH ≈ 6,460

A trigger fires only on a closing basis — the index must close at or below the level. Intraday touches do not count. Deployment of a fired tranche happens on the next trading day, regardless of headlines.

## Step 3 — Tranche schedule

Split D as follows the day it is identified:

- Tranche 0 — 40% of D: deploy immediately. No waiting, no conditions. This respects the statistical reality that immediate investment beats waiting roughly two-thirds of the time.
- Tranche 1 — 20% of D: deploys when T1 fires (−5% from ATH).
- Tranche 2 — 20% of D: deploys when T2 fires (−10% from ATH).
- Tranche 3 — 20% of D: deploys when T3 fires (−15% from ATH).

Time backstop (this rule is what makes the algorithm honest):
- Any portion of Tranche 1 not yet deployed by month 6 deploys at month 6.
- Tranche 2 undeployed by month 9 deploys at month 9.
- Tranche 3 undeployed by month 12 deploys at month 12.

The backstop exists because the most expensive mistake in this entire system is waiting in cash for a dip that arrives years later at higher prices. The market owes you nothing, including a correction.

## Step 4 — Destination rule (what the money buys)

Tranches do NOT automatically mirror the weekly SIP split. Each tranche buys whatever is furthest below target allocation at the time it deploys.

Target allocation (total portfolio, excluding land; set deliberately, amend only at annual review):
- Equity: 60% (roughly balanced between Indian funds and US funds; US side diversified beyond mega-cap tech as it grows)
- Gold (SGB): 5–10%
- Fixed income (FD/PPF/liquid): 30–35%
- Any single stock (e.g., NOK): hard cap 5% of total equity. No exceptions during deployments.

Routing constraint (India-specific): track total LRS remittances per financial year. If a tranche would push the year's remittances past the ₹10 lakh TCS threshold, route that tranche to Indian mutual funds instead, or defer the remittance to the next financial year if the time backstop allows. Verify the current threshold each April — budgets change it.

## Step 5 — Monitoring and alert layer

The algorithm is monitored by machines, not by mood:

1. Broker / TradingView price alerts set at the three trigger levels (real-time push).
2. Claude Cowork scheduled task (desktop app, /schedule): every weekday morning, fetch the S&P 500 close and ATH, compute drawdown, report which tranches have fired, flag "TRANCHE TRIGGERED" if new, and note NOK moves >10% in a week.
3. Claude chat (on demand): when an alert fires, open the app and discuss before executing — to confirm the trigger against the rules and check nothing structural has changed (income loss, new obligation), NOT to debate whether "this dip feels different." The rules already decided.

## Step 6 — Standing events calendar (deployments that need no market signal)

- Land payoff (≈ 8–10 months out): the freed ₹70k/month is pre-committed to investments per the target allocation. Written destination decided before the final instalment.
- ULIP maturity (next year): ₹8L proceeds become a new D. Run this algorithm from Step 1. Do not roll into any new insurance product.
- Excess FD capital (≈ ₹15L+ above the emergency floor): this is the current D candidate. Run Step 1 with exact FD maturity dates to avoid premature-withdrawal penalties — align tranche deployments with maturities where possible.
- Cars24 ESOPs: valued at ₹0. Revisit only if a real IPO prices.

## Anti-rules (violations void the system)

1. Never deploy based on news, excitement, a tip, or a "feeling." Triggers are numeric and closing-basis only.
2. Never deploy emergency-floor or obligation money. No market condition changes this.
3. Never let a single stock exceed 5% of equity. Hot narratives are how the cap gets tested; the cap is the answer.
4. Never amend these rules mid-drawdown. Amendments happen once a year, in calm markets, in writing.
5. Never skip a time backstop because the market "feels toppy." Feeling toppy is not a level.

## What this algorithm does not do

It does not predict bottoms, beat the market, or guarantee the cheapest entry. Roughly two times out of three, plain immediate deployment of all of D will beat it. What it buys instead: participation from day one (Tranche 0), dry powder if a real correction comes (T1–T3), immunity from regret-driven mistakes, and a guarantee that the cash is fully invested within 12 months no matter what. The edge is behavioral, not predictive — which is the only kind of edge that reliably exists.
