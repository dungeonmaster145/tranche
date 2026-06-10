import { remitWarning, formatMoney } from "../lib/algorithm.js";

/**
 * RemitTracker — running total of cross-border remittances this
 * financial year against the tax-collected-at-source threshold
 * (India LRS: Rs 10 lakh by default; configurable; hidden if 0).
 */
export default function RemitTracker({ plan, remitted, onChange }) {
  const threshold = plan.config.remitThreshold;
  if (!threshold) return null;
  const n = Number(remitted) || 0;
  const pct = Math.min(100, (n / threshold) * 100);
  const warn = remitWarning(plan, n, threshold);

  return (
    <div className="card">
      <h2 style={{ fontSize: 15 }}>Remittance / TCS tracker</h2>
      <p className="sub" style={{ marginBottom: 14 }}>
        Crossing the threshold triggers tax collected at source on the excess
        (recoverable at filing, but it locks up cash). Route tranches to
        domestic funds or the next financial year when close. Verify the
        current threshold each April — budgets change it.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div className="field" style={{ flex: "0 0 200px" }}>
          <label htmlFor="remit">Remitted this FY</label>
          <input id="remit" type="number" min="0" placeholder="total sent abroad"
            value={remitted} onChange={(e) => onChange(e.target.value)} />
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div className="meter">
            <div className={"meter-fill" + (n > threshold ? " is-over" : "")} style={{ width: pct + "%" }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, fontFamily: "var(--mono)" }}>
            {formatMoney(n, plan.config)} of {formatMoney(threshold, plan.config)} threshold
            {warn && (
              <span style={{ color: "var(--red)", fontWeight: 600 }}>
                {" "}— next tranche would cross it: consider the domestic route or next FY
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
