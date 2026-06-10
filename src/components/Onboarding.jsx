import { useState } from "react";

/**
 * Onboarding — four short steps that teach the philosophy before the tool.
 * Step 3 is interactive: the user drags a market crash and watches
 * tranches fire, learning the mechanism by playing with it.
 */
const STEPS = [
  {
    title: "Nobody can tell you the bottom",
    body: "Every investor sitting on cash asks the same question: is now the right time? The honest answer, backed by decades of market history, is that nobody knows — not analysts, not algorithms, not AI. Tools that promise to call the bottom are selling astrology with a dashboard. This tool refuses to pretend otherwise.",
  },
  {
    title: "Waiting is the expensive mistake",
    body: "Studies of historical markets (Vanguard's lump-sum research is the famous one) find that investing immediately beats waiting for a dip roughly two times out of three, because markets rise more often than they fall. Cash waiting for the perfect entry usually watches prices run away from it. The dip eventually comes — often at levels higher than where the waiting began.",
  },
  {
    title: "So we pre-commit rules instead",
    body: "Tranche splits your surplus: a large slice deploys immediately (respecting the statistics), and the rest waits at pre-set drawdown triggers with hard time backstops so nothing waits forever. You write the rules while calm. The tool executes them while the market is screaming. Drag the market down and watch the mechanism work:",
    interactive: true,
  },
  {
    title: "The edge is behavioral, not predictive",
    body: "This system will not beat simply investing everything on day one, most of the time. What it buys is different: participation from day one, dry powder if a real correction arrives, immunity from panic and regret, and a guarantee your cash is fully invested within twelve months no matter what. The only reliable edge in markets is the one over your own emotions. That is the entire niche.",
  },
];

function MiniSim() {
  const [dd, setDd] = useState(0);
  const triggers = [5, 10, 15];
  return (
    <div style={{ marginTop: 18 }}>
      <div className="range-row">
        <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)" }}>ATH</span>
        <input
          type="range" min="0" max="20" step="0.5" value={dd}
          aria-label="Simulated market drawdown"
          onChange={(e) => setDd(Number(e.target.value))}
        />
        <span className="range-value" style={{ color: dd >= 5 ? "var(--red)" : "var(--green)" }}>
          −{dd.toFixed(1)}%
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <span className="badge badge-deployed">T0 · 40% — deployed day one</span>
        {triggers.map((t, i) => (
          <span key={t} className={"badge " + (dd >= t ? "badge-triggered" : "badge-waiting")}>
            T{i + 1} · 20% — {dd >= t ? "FIRED" : "waits at −" + t + "%"}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Onboarding({ onDone }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;
  return (
    <div className="card onboard-step" key={i}>
      <div className="eyebrow">Why this tool exists · {i + 1} of {STEPS.length}</div>
      <h2 style={{ fontSize: 22, marginTop: 8 }}>{step.title}</h2>
      <p className="sub" style={{ fontSize: 15, marginBottom: 8 }}>{step.body}</p>
      {step.interactive && <MiniSim />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <div className="dots" aria-hidden="true">
          {STEPS.map((_, d) => <span key={d} className={d <= i ? "on" : ""} />)}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {i > 0 && (
            <button className="btn btn-ghost" onClick={() => setI(i - 1)}>Back</button>
          )}
          <button className="btn btn-primary" onClick={() => (last ? onDone() : setI(i + 1))}>
            {last ? "Open the ledger" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
