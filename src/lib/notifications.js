/**
 * notifications.js — reminder scheduling behind one interface.
 *
 * WEB (today): uses the browser Notification API for permission and for
 * immediate confirmations, and stores scheduled reminders so the app can
 * surface any that are due whenever it's next opened. A static web page
 * genuinely cannot wake itself, so true background delivery is honestly
 * out of scope here — see MOBILE note below.
 *
 * MOBILE (Capacitor): replace the marked block with
 * @capacitor/local-notifications. On a device, the OS delivers these on
 * schedule even when the app is closed — no server required. This file is
 * the ONLY place that changes; the rest of the app calls these functions
 * unchanged. See docs/MOBILE.md.
 */

const STORE_KEY = "tranche-reminders-v1";

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestPermission() {
  if (!notificationsSupported()) return "unsupported";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function permissionStatus() {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission; // "granted" | "denied" | "default"
}

function loadReminders() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReminders(list) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked — non-fatal */
  }
}

/**
 * Schedule a reminder. On web this is recorded and shown when due the next
 * time the app opens. On mobile (Capacitor) this maps directly to
 * LocalNotifications.schedule with the same id/title/body/at.
 */
export function scheduleReminder({ id, title, body, at }) {
  // --- CAPACITOR SWAP START (see docs/MOBILE.md) ---
  // import { LocalNotifications } from "@capacitor/local-notifications";
  // await LocalNotifications.schedule({ notifications: [{
  //   id: hashId(id), title, body, schedule: { at: new Date(at) }
  // }]});
  // return;
  // --- CAPACITOR SWAP END ---

  const list = loadReminders().filter((r) => r.id !== id);
  list.push({ id, title, body, at, delivered: false });
  saveReminders(list);
}

export function cancelReminder(id) {
  saveReminders(loadReminders().filter((r) => r.id !== id));
}

export function listReminders() {
  return loadReminders().sort((a, b) => new Date(a.at) - new Date(b.at));
}

/**
 * Web fallback: call on app open. Fires a browser notification for any
 * reminder whose time has passed and that hasn't been delivered yet, then
 * marks it delivered. Returns the count surfaced (for an in-app banner too).
 */
export function deliverDueReminders(now = new Date()) {
  const list = loadReminders();
  let delivered = 0;
  for (const r of list) {
    if (!r.delivered && new Date(r.at) <= now) {
      if (permissionStatus() === "granted") {
        try { new Notification(r.title, { body: r.body }); } catch { /* ignore */ }
      }
      r.delivered = true;
      delivered++;
    }
  }
  if (delivered) saveReminders(list);
  return delivered;
}

/** Convenience: the standard set of reminders Tranche offers. */
export function buildStandardReminders({ cadence, plan }) {
  const out = [];
  const now = new Date();

  if (cadence && cadence !== "off") {
    const next = new Date(now);
    next.setDate(next.getDate() + (cadence === "daily" ? 1 : 7));
    next.setHours(9, 30, 0, 0);
    out.push({
      id: "reading-reminder",
      title: "Record today's market reading",
      body: "Open Tranche, enter the index close and its peak. Thirty seconds.",
      at: next.toISOString(),
    });
  }

  if (plan) {
    for (const t of plan.tranches) {
      if (t.deployed || t.trigger === 0) continue;
      const d = new Date(plan.startDate);
      d.setMonth(d.getMonth() + t.backstopMonths);
      d.setHours(9, 30, 0, 0);
      out.push({
        id: "backstop-" + t.id,
        title: t.label + " backstop approaching",
        body: "If this tranche hasn't triggered, its deadline to deploy anyway is near.",
        at: d.toISOString(),
      });
    }
  }
  return out;
}
