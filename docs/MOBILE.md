# Mobile (Capacitor) — turning Tranche into an installable app

This takes the exact web app and wraps it as a native Android/iOS app with
**on-device notifications that fire on schedule even when the app is closed** —
no server required. The web code is reused wholesale; only two files change.

## Prerequisites

- Node installed (you have it).
- **Android**: Android Studio.
- **iOS**: a Mac with Xcode (Apple's requirement, not ours).

## 1. Add Capacitor

```bash
cd tranche
npm install @capacitor/core @capacitor/cli @capacitor/local-notifications
npx cap init Tranche com.yourname.tranche --web-dir=dist
npm run build
npx cap add android      # and/or:
npx cap add ios
```

## 2. Swap the two device-facing files

Both files were written so the swap is mechanical and isolated — the rest of
the app calls them unchanged.

**`src/lib/storage.js`** — replace the localStorage body with Capacitor
Preferences (survives app restarts properly on device):

```js
import { Preferences } from "@capacitor/preferences";
const KEY = "tranche-state-v1";
export async function loadState() {
  const { value } = await Preferences.get({ key: KEY });
  return value ? JSON.parse(value) : null;
}
export async function saveState(state) {
  await Preferences.set({ key: KEY, value: JSON.stringify(state) });
  return true;
}
export async function clearState() {
  await Preferences.remove({ key: KEY });
}
```
(Add `@capacitor/preferences` to the install line in step 1 if you go this route.)

**`src/lib/notifications.js`** — activate the block marked
`CAPACITOR SWAP START / END` inside `scheduleReminder`, and request permission
through the plugin. The OS now delivers reminders on schedule:

```js
import { LocalNotifications } from "@capacitor/local-notifications";

export async function requestPermission() {
  const res = await LocalNotifications.requestPermissions();
  return res.display === "granted" ? "granted" : "denied";
}

export async function scheduleReminder({ id, title, body, at }) {
  await LocalNotifications.schedule({
    notifications: [{
      id: Math.abs(hashCode(id)),         // LocalNotifications needs an int id
      title, body,
      schedule: { at: new Date(at) },
    }],
  });
}

function hashCode(s){let h=0;for(let i=0;i<s.length;i++){h=(h<<5)-h+s.charCodeAt(i)|0;}return h;}
```

## 3. Build and run

```bash
npm run build && npx cap sync
npx cap open android      # builds the APK/AAB in Android Studio
npx cap open ios          # opens Xcode
```

## 4. Ship to stores (the part only you can do)

- **Google Play**: one-time $25 developer account; upload the signed AAB.
- **Apple App Store**: $99/year; archive in Xcode and submit via App Store Connect.
- **Review note**: keep the "educational, not financial advice" disclaimer
  visible (it's in the footer and onboarding already). Finance apps get extra
  scrutiny; the honest framing is also the compliant one.

## What still needs a server (later, and in Java)

On-device notifications cover reminders and backstop-date warnings. What they
**cannot** do is watch the market while the user is away and push "the index
just closed down 10%." That requires an always-on backend. Per the owner's
preference that service will be built in **Java / Spring Boot**: a
`@Scheduled` poller against a market-data API, user plans/triggers in Postgres
via Spring Data JPA, a small REST API the app calls, and push delivery via
Firebase Cloud Messaging. Until then, the honest real-time layer is the user's
own broker price alerts. See docs/ROADMAP.md.
