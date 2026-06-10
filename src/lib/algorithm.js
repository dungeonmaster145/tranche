/**
 * algorithm.js — the entire deployment algorithm as pure functions.
 *
 * No UI, no storage, no network. Everything here is deterministic and
 * unit-testable, which is the point: the rules should be inspectable
 * by anyone before they trust them with money.
 */

export const DEFAULT_CONFIG = {
  // Tranche split: 40% immediately, 3 x 20% at drawdown triggers.
  splits: [0.4, 0.2, 0.2, 0.2],
  // Drawdown triggers (% below all-time closing high). 0 = immediate.
  triggers: [0, 5, 10, 15],
  // Time backstops in months from plan start. Untriggered tranches
  // deploy at their backstop no matter what the market is doing.
  backstops: [0, 6, 9, 12],
  // Remittance threshold for tax-collected-at-source tracking
  // (India LRS default: Rs 10,00,000 per financial year). Set to 0 to hide.
  remitThreshold: 1000000,
  currency: "INR",
  locale: "en-IN",
};

/**
 * Step 1 — deployable surplus.
 * Only money that clears all four gates enters the algorithm.
 */
export function computeSurplus({ liquidCash = 0, emergencyFloor = 0, obligations = 0, earmarked = 0 }) {
  return Number(liquidCash) - Number(emergencyFloor) - Number(obligations) - Number(earmarked);
}

/** Build a locked plan from a surplus D. Returns null if D <= 0. */
export function buildPlan(D, config = DEFAULT_CONFIG, startDate = new Date().toISOString()) {
  if (!(D > 0)) return null;
  const tranches = config.splits.map((pct, i) => ({
    id: "T" + i,
    label: "Tranche " + i,
    pct,
    trigger: config.triggers[i],
    backstopMonths: config.backstops[i],
    amount: Math.round(D * pct),
    deployed: false,
    deployedOn: null,
  }));
  return { D, startDate, tranches, config };
}

/** Percentage drawdown of current level from the all-time high. */
export function drawdownPct(current, ath) {
  if (!(current > 0) || !(ath > 0)) return null;
  return Math.max(0, ((ath - current) / ath) * 100);
}

/** Index level at which a trigger fires, given the ATH. */
export function triggerLevel(ath, triggerPct) {
  return Math.round(ath * (1 - triggerPct / 100));
}

/** ISO date of a tranche's time backstop. */
export function backstopDate(startDateISO, months) {
  const d = new Date(startDateISO);
  d.setMonth(d.getMonth() + months);
  return d;
}

/** Has the time backstop passed for this tranche? */
export function backstopPassed(plan, tranche, now = new Date()) {
  return now >= backstopDate(plan.startDate, tranche.backstopMonths);
}

/**
 * Status of a tranche given the latest observed drawdown.
 * "deployed" | "triggered" | "backstop" | "waiting"
 * Triggers are evaluated on CLOSING levels only — pass a closing drawdown.
 */
export function statusOf(tranche, drawdown, plan, now = new Date()) {
  if (tranche.deployed) return "deployed";
  if (tranche.trigger === 0) return "triggered";
  if (drawdown != null && drawdown >= tranche.trigger) return "triggered";
  if (plan && backstopPassed(plan, tranche, now)) return "backstop";
  return "waiting";
}

/** Count of tranches currently demanding action. */
export function actionableCount(plan, drawdown, now = new Date()) {
  if (!plan) return 0;
  return plan.tranches.filter((t) => {
    const s = statusOf(t, drawdown, plan, now);
    return s === "triggered" || s === "backstop";
  }).length;
}

/** Would deploying the next undeployed tranche cross the remittance threshold? */
export function remitWarning(plan, remittedThisFY, threshold) {
  if (!plan || !threshold) return false;
  const next = plan.tranches.find((t) => !t.deployed);
  if (!next) return false;
  return Number(remittedThisFY) + next.amount > threshold;
}

export function formatMoney(n, config = DEFAULT_CONFIG) {
  const symbol = config.currency === "INR" ? "\u20B9" : config.currency + " ";
  return symbol + new Intl.NumberFormat(config.locale).format(Math.round(Number(n) || 0));
}

export function formatDate(d, config = DEFAULT_CONFIG) {
  return new Date(d).toLocaleDateString(config.locale, { day: "numeric", month: "short", year: "numeric" });
}
