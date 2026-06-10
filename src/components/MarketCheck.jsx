import { useState } from "react";

/**
 * MarketCheck — enter the index's latest CLOSE and its all-time closing
 * high (any finance site has both), or flip into simulation mode to
 * stress-test the plan without touching real state.
 *
 * Deliberately manual in v1: the act of looking up the close once a day
 * is the ritual, and it keeps the tool free of API keys, rate limits,
 * and a backend. docs/ROADMAP.md describes the pluggable data-provider
 * design for auto-fetch in later versions.
 */
export default function MarketCheck({ onReading, onSimulate, simulating }) {
  const [current, setCurrent] = useState("");
  const [ath, setAth] = useState("");
  const [sim, setSim] = useState(0);
  const [err, setErr] = useState("");

  const record = () => {
    const c = Number(current);
    const a = Number(ath);
    if (!(c > 0) || !(a > 0)) { setErr("Both numbers are needed."); return; }
    if (c > a) { setErr("The current close is above your ATH — congratulations, that IS the new ATH. Enter it in both fields."); return; }
    setErr("");
    onReading(c, a);
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ margin: 0 }}>Market reading</h2>
        <button className="linklike" onClick={() => { onSimulate(simulating ? null : sim); }}>
          {simulating ? "Exit simulation" : "Simulate a crash instead"}
        </button>
      </div>

      {!simulating ? (
        <>
          <p className="sub" style={{ marginTop: 6 }}>
            Closing levels only — intraday touches do not fire triggers.
            Look up today's S&P 500 close and the all-time closing high.
          </p>
          {err && <div className="alert alert-error">{err}</div>}
          <div className="grid" style={{ alignItems: "end" }}>
            <div className="field">
              <label htmlFor="mc-current">Latest close</label>
              <input id="mc-current" type="number" placeholder="e.g. 7386.65" value={current}
                onChange={(e) => setCurrent(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="mc-ath">All-time closing high</label>
              <input id="mc-ath" type="number" placeholder="e.g. 7600" value={ath}
                onChange={(e) => setAth(e.target.value)} />
            </div>
            <button className="btn btn-green" onClick={record}>Record reading</button>
          </div>
        </>
      ) : (
        <>
          <p className="sub" style={{ marginTop: 6 }}>
            Simulation mode — drag the market down and watch your tranches
            respond. Nothing is saved; this is a fire drill.
          </p>
          <div className="range-row">
            <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)" }}>ATH</span>
            <input
              type="range" min="0" max="20" step="0.25" value={sim}
              aria-label="Simulated drawdown percent"
              onChange={(e) => { const v = Number(e.target.value); setSim(v); onSimulate(v); }}
            />
            <span className="range-value" style={{ color: sim >= 5 ? "var(--red)" : "var(--green)" }}>
              −{sim.toFixed(2)}%
            </span>
          </div>
        </>
      )}
    </div>
  );
}
