import { useState } from "react";
import { CONCEPTS, GLOSSARY } from "../lib/education.js";

/**
 * Learn — the education layer. Concept cards up top for the ideas that
 * change behavior, an expandable glossary below for terms. Everything
 * explains; nothing instructs. Collapsed by default so it never crowds
 * the working tool.
 */
export default function Learn() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState(null);

  return (
    <div className="card">
      <button
        className="learn-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>
          <span className="eyebrow">Learn</span>
          <span className="learn-title">Understand before you deploy</span>
        </span>
        <span className="learn-chev" style={{ transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </button>

      {open && (
        <div className="learn-body">
          <div className="concept-grid">
            {CONCEPTS.map((c) => (
              <div key={c.id} className="concept">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>

          <div className="glossary">
            <div className="eyebrow" style={{ marginBottom: 10 }}>Glossary</div>
            {GLOSSARY.map((g) => {
              const isOpen = term === g.term;
              return (
                <div key={g.term} className="gloss-row">
                  <button
                    className="gloss-head"
                    onClick={() => setTerm(isOpen ? null : g.term)}
                    aria-expanded={isOpen}
                  >
                    <span className="gloss-term">{g.term}</span>
                    <span className="gloss-short">{g.short}</span>
                  </button>
                  {isOpen && <p className="gloss-long">{g.long}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
