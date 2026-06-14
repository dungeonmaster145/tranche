import { useEffect, useState } from "react";
import { buildPlan, drawdownPct, actionableCount, formatMoney, formatDate } from "./lib/algorithm.js";
import { loadState, saveState, clearState } from "./lib/storage.js";
import Onboarding from "./components/Onboarding.jsx";
import SurplusCalculator from "./components/SurplusCalculator.jsx";
import DrawdownGauge from "./components/DrawdownGauge.jsx";
import MarketCheck from "./components/MarketCheck.jsx";
import TrancheBoard from "./components/TrancheBoard.jsx";
import RemitTracker from "./components/RemitTracker.jsx";
import Learn from "./components/Learn.jsx";
import Reminders from "./components/Reminders.jsx";
import { deliverDueReminders } from "./lib/notifications.js";

export default function App() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [plan, setPlan] = useState(null);
  const [reading, setReading] = useState(null); // { current, ath, drawdown, at }
  const [remitted, setRemitted] = useState("");
  const [simDD, setSimDD] = useState(null); // simulation drawdown or null
  const [cadence, setCadence] = useState("off");

  useEffect(() => {
    (async () => {
      const s = await loadState();
      if (s) {
        setOnboarded(!!s.onboarded);
        setPlan(s.plan || null);
        setReading(s.reading || null);
        setRemitted(s.remitted ?? "");
        setCadence(s.cadence ?? "off");
      }
      setReady(true);
      // Web fallback: surface any reminders that came due while away.
      deliverDueReminders();
    })();
  }, []);

  const persist = (patch) =>
    saveState({
      onboarded,
      plan,
      reading,
      remitted,
      cadence,
      ...patch,
    });

  const changeCadence = (value) => { setCadence(value); persist({ cadence: value }); };

  const finishOnboarding = () => { setOnboarded(true); persist({ onboarded: true }); };

  const lockPlan = (D, cfg) => {
    const p = buildPlan(D, cfg);
    setPlan(p);
    persist({ plan: p });
  };

  const recordReading = (current, ath) => {
    const r = { current, ath, drawdown: drawdownPct(current, ath), at: new Date().toISOString() };
    setReading(r);
    setSimDD(null);
    persist({ reading: r });
  };

  const deploy = (id) => {
    const p = {
      ...plan,
      tranches: plan.tranches.map((t) =>
        t.id === id ? { ...t, deployed: true, deployedOn: formatDate(new Date(), plan.config) } : t
      ),
    };
    setPlan(p);
    persist({ plan: p });
  };

  const reset = async () => {
    setPlan(null); setReading(null); setSimDD(null); setRemitted("");
    await clearState();
    await saveState({ onboarded: true, plan: null, reading: null, remitted: "" });
  };

  if (!ready) {
    return <div className="shell" style={{ fontFamily: "var(--mono)", color: "var(--muted)" }}>Opening the ledger…</div>;
  }

  const simulating = simDD !== null;
  const effDD = simulating ? simDD : reading ? reading.drawdown : null;
  const fired = plan ? actionableCount(plan, effDD) : 0;

  return (
    <div className="shell">
      <header className="masthead">
        <div>
          <div className="eyebrow">Deployment ledger · v1</div>
          <h1>Tranche</h1>
        </div>
        <div className="stamp">
          {reading
            ? <>Last reading: {formatDate(reading.at, plan?.config)}<br />close {reading.current.toLocaleString()} · ATH {reading.ath.toLocaleString()}</>
            : "No market reading yet"}
        </div>
      </header>

      {!onboarded && <div className="screen" key="onboard"><Onboarding onDone={finishOnboarding} /></div>}

      {onboarded && !plan && (
        <div className="screen" key="calc">
          <SurplusCalculator onLock={lockPlan} />
          <Learn />
        </div>
      )}

      {onboarded && plan && (
        <div className="screen" key="ledger">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 14 }}>
              <span style={{ color: "var(--muted)" }}>Locked plan · D = </span>
              <span style={{ fontWeight: 700, color: "var(--green)", fontSize: 18 }}>{formatMoney(plan.D, plan.config)}</span>
              <span style={{ color: "var(--muted)" }}> · started {formatDate(plan.startDate, plan.config)}</span>
            </div>
            <button className="btn btn-ghost" onClick={reset}>Reset plan</button>
          </div>

          {fired > 0 && (
            <div className="alert alert-danger" role="alert">
              <span className="alert-stamp">{simulating ? "SIMULATION" : "ACTION REQUIRED"}</span>
              {fired} tranche{fired > 1 ? "s" : ""} {simulating ? "would be" : ""} ready to deploy per your
              rules. Verify against closing levels, then execute on the next trading day.
              The rules already decided — do not renegotiate with them.
            </div>
          )}

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>Drawdown gauge {simulating && <span style={{ color: "var(--amber)", fontSize: 13 }}>(simulation)</span>}</h2>
              {effDD != null && (
                <div style={{ fontFamily: "var(--mono)", fontSize: 14 }}>
                  <span style={{ color: "var(--muted)" }}>from ATH: </span>
                  <span style={{ fontWeight: 700, color: effDD >= 5 ? "var(--red)" : "var(--green)" }}>
                    −{effDD.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
            <DrawdownGauge
              drawdown={effDD}
              triggers={plan.config.triggers.filter((t) => t > 0)}
              simulated={simulating}
            />
          </div>

          <MarketCheck
            onReading={recordReading}
            onSimulate={setSimDD}
            simulating={simulating}
          />

          <TrancheBoard
            plan={plan}
            drawdown={effDD}
            ath={simulating ? null : reading?.ath}
            onDeploy={deploy}
          />

          <RemitTracker
            plan={plan}
            remitted={remitted}
            onChange={(v) => { setRemitted(v); persist({ remitted: v }); }}
          />

          <Reminders plan={plan} cadence={cadence} onCadence={changeCadence} />

          <Learn />

          <div className="footnote">
            Anti-rules: triggers fire on closing levels only · never deploy floor
            or obligation money · single stocks capped at 5% of equity · no rule
            changes mid-drawdown · backstops are not optional. This tool executes
            your pre-written rules; it does not predict markets. Educational
            software — not financial, tax, or investment advice.
          </div>
        </div>
      )}
    </div>
  );
}
