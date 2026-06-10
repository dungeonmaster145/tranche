/**
 * storage.js — persistence behind a tiny async interface.
 *
 * The app only ever calls loadState() and saveState(). Today the
 * implementation is browser localStorage; for the mobile build this
 * file is the ONLY thing that changes (React Native AsyncStorage,
 * Capacitor Preferences, or a synced backend all fit this interface).
 */

const KEY = "tranche-state-v1";

export async function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("tranche: failed to load state", e);
    return null;
  }
}

export async function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error("tranche: failed to save state", e);
    return false;
  }
}

export async function clearState() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    console.error("tranche: failed to clear state", e);
  }
}
