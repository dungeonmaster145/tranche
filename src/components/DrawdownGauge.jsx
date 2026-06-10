/**
 * DrawdownGauge — the signature element. A ruled scale from the
 * all-time high down to −20%, with the three trigger marks and an
 * animated needle showing where the market (real or simulated) sits.
 */
export default function DrawdownGauge({ drawdown, triggers = [5, 10, 15], simulated = false }) {
  const clamp = (v) => Math.max(0, Math.min(20, v));
  const x = drawdown == null ? null : 20 + clamp(drawdown) * 30;

  return (
    <svg
      viewBox="0 0 640 92"
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label={
        drawdown == null
          ? "Drawdown gauge, no reading yet"
          : `Market is ${drawdown.toFixed(2)} percent below its all-time high${simulated ? " (simulated)" : ""}`
      }
    >
      <line x1="20" y1="46" x2="620" y2="46" stroke="var(--line)" strokeWidth="2" />
      {[0, 5, 10, 15, 20].map((p) => (
        <g key={p}>
          <line x1={20 + p * 30} y1="38" x2={20 + p * 30} y2="54" stroke="var(--muted)" strokeWidth="1.5" />
          <text x={20 + p * 30} y="76" textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">
            {p === 0 ? "ATH" : "−" + p + "%"}
          </text>
        </g>
      ))}
      {triggers.map((p, i) => (
        <g key={"t" + p}>
          <circle
            cx={20 + p * 30} cy="46" r="6"
            fill={drawdown != null && drawdown >= p ? "var(--red)" : "var(--paper)"}
            stroke="var(--ink)" strokeWidth="1.5"
          />
          <text x={20 + p * 30} y="24" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--ink)" fontFamily="var(--mono)">
            T{i + 1}
          </text>
        </g>
      ))}
      {x != null && (
        <g className="gauge-needle" style={{ transform: `translateX(${x - 20}px)` }}>
          <line x1="20" y1="32" x2="20" y2="60" stroke={simulated ? "var(--amber)" : "var(--green)"} strokeWidth="3" />
          <polygon points="15,28 25,28 20,36" fill={simulated ? "var(--amber)" : "var(--green)"} />
        </g>
      )}
    </svg>
  );
}
