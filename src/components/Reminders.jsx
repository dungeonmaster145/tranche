import { useEffect, useState } from "react";
import {
  notificationsSupported, requestPermission, permissionStatus,
  scheduleReminder, cancelReminder, listReminders, buildStandardReminders,
} from "../lib/notifications.js";
import { formatDate } from "../lib/algorithm.js";

/**
 * Reminders — the user manages when Tranche nudges them. On web these are
 * best-effort (delivered when the app is next opened); on mobile they fire
 * on schedule via the OS. The copy is honest about that difference.
 */
export default function Reminders({ plan, cadence, onCadence }) {
  const [perm, setPerm] = useState(permissionStatus());
  const [items, setItems] = useState(listReminders());

  useEffect(() => { setItems(listReminders()); }, [cadence, plan]);

  const enable = async () => {
    const result = await requestPermission();
    setPerm(result);
  };

  const applyCadence = (value) => {
    onCadence(value);
    // rebuild the standard reminder set
    ["reading-reminder"].forEach(cancelReminder);
    const built = buildStandardReminders({ cadence: value, plan });
    built.forEach(scheduleReminder);
    setItems(listReminders());
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: 15 }}>Reminders</h2>
      <p className="sub" style={{ marginBottom: 16 }}>
        Tranche can nudge you to record a reading and warn you as a tranche's
        backstop date nears. On your phone (installed app) these arrive on
        schedule. In a browser tab they appear next time you open Tranche —
        for true real-time market alerts, your broker's free price alerts are
        the right tool.
      </p>

      {!notificationsSupported() ? (
        <div className="note">This browser doesn't support notifications. The installed mobile app will.</div>
      ) : perm !== "granted" ? (
        <button className="btn btn-green" onClick={enable}>
          {perm === "denied" ? "Notifications blocked — enable in browser settings" : "Turn on notifications"}
        </button>
      ) : (
        <div className="cadence">
          <span className="cadence-label">Remind me to record a reading:</span>
          <div className="seg">
            {["off", "daily", "weekly"].map((c) => (
              <button
                key={c}
                className={"seg-btn" + (cadence === c ? " on" : "")}
                onClick={() => applyCadence(c)}
              >
                {c === "off" ? "Off" : c[0].toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="reminder-list">
          {items.map((r) => (
            <div key={r.id} className="reminder-row">
              <div>
                <div className="reminder-title">{r.title}</div>
                <div className="reminder-when">{formatDate(r.at)} · 9:30 AM</div>
              </div>
              <button className="linklike" onClick={() => { cancelReminder(r.id); setItems(listReminders()); }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
