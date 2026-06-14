# Roadmap

## v1.0 — shipped
Web app: onboarding with interactive crash simulator, surplus (D) calculator
with configurable tranche rules, drawdown gauge, manual market readings +
simulation mode, tranche board with deploy tracking, LRS/TCS tracker,
localStorage persistence. Zero backend.

## v1.1 — shipped in this build
- **Education layer** (`src/lib/education.js`, `Learn.jsx`): concept cards
  (why timing fails, what drawdowns mean, savings rate, hidden concentration)
  and an expandable glossary. Strictly educational — explains concepts and the
  user's own situation, never issues buy/sell instructions.
- **Reminders** (`src/lib/notifications.js`, `Reminders.jsx`): permission flow,
  daily/weekly reading reminders, and backstop-date warnings. On web these are
  best-effort (delivered on next open); on mobile they fire on schedule.

## v1.2 — mobile app (Play Store / App Store)
Capacitor wrap of this exact build with native on-device notifications. Two
files change (`storage.js` → Preferences, `notifications.js` → LocalNotifications).
Full steps in docs/MOBILE.md. Local notifications need no server.

## v2.0 — always-on alert backend (Java / Spring Boot)
The only feature that genuinely needs a server: watching the market while the
user is away and pushing "the index closed below your −10% trigger."

Planned stack (owner is a Java developer — built in Spring Boot for
maintainability):
- **Spring Boot** REST service; user plans, tranches, and trigger levels in
  **PostgreSQL** via **Spring Data JPA**.
- **`@Scheduled`** job polling a market-data provider for index closes; on a
  crossed trigger, enqueue a push.
- **Firebase Cloud Messaging** for delivery to the Capacitor app (FCM token
  registered from the device).
- Auth via Spring Security (email magic-link or OAuth); per-user isolation.
- The app keeps working fully offline without this service — the backend is
  additive, only for real-time push.

Cost/ops note: this is the stage with monthly bills (hosting, market data) and
uptime responsibility. Reach it when real users ask for it, not before. India:
confirm the SEBI line — generic education is fine; personalized investment
*advice* for compensation is regulated (RIA registration).

## Non-goals, permanently
- Predicting markets or telling anyone "the best time."
- Auto-executing trades — a human marks every deployment by design.
- Personalized buy/sell recommendations (education and self-reflection only).
