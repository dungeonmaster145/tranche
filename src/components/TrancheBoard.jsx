import { statusOf, triggerLevel, backstopDate, formatMoney, formatDate } from "../lib/algorithm.js";

/**
 * TrancheBoard — one ruled row per tranche: amount, rule, live status,
 * computed index trigger level, time backstop, and the deploy action.
 */
const BADGE = {
  deployed: (t) => ({ cls: "badge-deployed", text: "Deployed " + (t.deployedOn || "") }),
  triggered: (t) => ({
    cls: "badge-triggered",
    text: t.trigger === 0 ? "Deploy now" : "TRIGGERED — deploy next trading day",
  }),
  backstop: () => ({ cls: "badge-triggered", text: "BACKSTOP REACHED — deploy regardless of market" }),
  waiting: (t, plan) => ({
    cls: "badge-waiting",
    text: "Waiting · backstop " + formatDate(backstopDate(plan.startDate, t.backstopMonths), plan.config),
  }),
};

export default function TrancheBoard({ plan, drawdown, ath, onDeploy }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {plan.tranches.map((t) => {
        const status = statusOf(t, drawdown, plan);
        const badge = BADGE[status](t, plan);
        return (
          <div key={t.id} className={"tranche-row is-" + status}>
            <div>
              <div className="tranche-head">
                <span style={{ fontWeight: 600, fontSize: 15 }}>{t.label}</span>
                <span className="tranche-amount">{formatMoney(t.amount, plan.config)}</span>
                <span className="tranche-rule">
                  {t.trigger === 0
                    ? "deploy immediately"
                    : `fires at −${t.trigger}% from ATH` + (ath ? ` (≈ ${triggerLevel(ath, t.trigger).toLocaleString()})` : "")}
                </span>
              </div>
              <span className={"badge " + badge.cls}>{badge.text}</span>
            </div>
            {!t.deployed && (
              <button
                className={"btn " + (status === "triggered" || status === "backstop" ? "btn-primary" : "btn-ghost")}
                onClick={() => onDeploy(t.id)}
              >
                Mark deployed
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
