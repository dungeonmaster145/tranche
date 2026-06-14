import { useState } from "react";
import { computeSurplus, formatMoney, DEFAULT_CONFIG } from "../lib/algorithm.js";
import CountUp from "./CountUp.jsx";

/**
 * SurplusCalculator — Step 1 of the algorithm.
 * Computes deployable surplus D live as the user types, refuses to
 * proceed if D <= 0, and exposes the tranche split / triggers as an
 * advanced section so the defaults are a starting point, not a cage.
 */
const FIELDS = [
  { key: "liquidCash", label: "Total liquid cash", hint: "Savings + FDs + idle balances" },
  { key: "emergencyFloor", label: "Emergency floor", hint: "3–6 months of expenses. Untouchable." },
  { key: "obligations", label: "Obligations, next 12m", hint: "EMIs, instalments, anything owed" },
  { key: "earmarked", label: "Earmarked, under 3 yrs", hint: "Trips, purchases, family plans" },
];

export default function SurplusCalculator({ onLock }) {
  const [vals, setVals] = useState({ liquidCash: "", emergencyFloor: "", obligations: "", earmarked: "" });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cfg, setCfg] = useState({ ...DEFAULT_CONFIG });
  const [err, setErr] = useState("");

  const D = computeSurplus(vals);
  const splitsOk = Math.abs(cfg.splits.reduce((a, b) => a + b, 0) - 1) < 0.001;

  const lock = () => {
    if (!(D > 0)) {
      setErr("D is zero or negative. Per Step 1, the algorithm does not run — there is no lump sum. Protecting the floor and obligations IS the system working.");
      return;
    }
    if (!splitsOk) {
      setErr("Tranche splits must add up to 100%.");
      return;
    }
    setErr("");
    onLock(D, cfg, vals);
  };

  return (
    <div className="card">
      <div className="eyebrow">Step 1</div>
      <h2>Compute deployable surplus (D)</h2>
      <p className="sub">
        Only money that clears all four gates enters the algorithm. Emergency
        and obligation money never deploys — in any market, including a crash
        that looks like a generational opportunity.
      </p>

      {err && <div className="alert alert-error">{err}</div>}

      <div className="grid" style={{ marginBottom: 20 }}>
        {FIELDS.map((f) => (
          <div className="field" key={f.key}>
            <label htmlFor={f.key}>{f.label}</label>
            <input
              id={f.key}
              type="number"
              min="0"
              placeholder="0"
              value={vals[f.key]}
              onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })}
            />
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 5 }}>{f.hint}</div>
          </div>
        ))}
      </div>

      <button className="linklike" onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? "Hide" : "Adjust"} tranche rules (defaults: 40/20/20/20 at −5/−10/−15%)
      </button>

      {showAdvanced && (
        <div style={{ marginTop: 14, padding: 16, background: "var(--paper)", borderRadius: 6, border: "1px dashed var(--line)" }}>
          <div className="grid">
            {cfg.splits.map((s, i) => (
              <div className="field" key={i}>
                <label>
                  T{i} split % {i > 0 ? `(fires at −${cfg.triggers[i]}%)` : "(immediate)"}
                </label>
                <input
                  type="number" min="0" max="100" value={Math.round(s * 100)}
                  onChange={(e) => {
                    const next = [...cfg.splits];
                    next[i] = (Number(e.target.value) || 0) / 100;
                    setCfg({ ...cfg, splits: next });
                  }}
                />
              </div>
            ))}
          </div>
          {!splitsOk && (
            <div style={{ fontSize: 12.5, color: "var(--red)", marginTop: 8 }}>
              Splits currently sum to {Math.round(cfg.splits.reduce((a, b) => a + b, 0) * 100)}% — they must total 100%.
            </div>
          )}
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, lineHeight: 1.6 }}>
            Rule of the house: adjust these now, in calm — never mid-drawdown.
            Time backstops (6 / 9 / 12 months) are fixed; they are what keeps
            the system honest.
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, borderTop: "1px dashed var(--line)", paddingTop: 16, marginTop: 18 }}>
        <div style={{ fontFamily: "var(--mono)" }} aria-live="polite">
          <span style={{ fontSize: 12, color: "var(--muted)" }}>D = </span>
          <CountUp
            value={D}
            format={(n) => formatMoney(n, cfg)}
            className={"d-readout " + (D > 0 ? "pos" : "neg")}
            style={{ fontSize: 28 }}
          />
        </div>
        <button className="btn btn-primary" onClick={lock}>Lock in plan</button>
      </div>
    </div>
  );
}
