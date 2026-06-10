# Deploying Tranche

This app is a static Vite build — no backend, no database, no secrets. That
makes hosting free and fast. Pick **one** web host below (Vercel is the
gentlest first time), get a live URL, then revisit the mobile section only
once the app has earned it.

---

## Before anything: push to GitHub

```bash
cd tranche
git init
git add .
git commit -m "Tranche v1.0 — rules-based lump-sum deployment"
# create an empty repo named "tranche" on github.com, then:
git remote add origin https://github.com/<your-username>/tranche.git
git branch -M main
git push -u origin main
```

---

## Option A — Vercel (recommended)

1. Go to vercel.com, sign in with GitHub.
2. **Add New → Project**, import your `tranche` repo.
3. Vercel auto-detects Vite from `vercel.json`. Leave everything default.
4. **Deploy.** ~30 seconds later you have a live `*.vercel.app` URL.
5. Every `git push` to `main` redeploys automatically.

Custom domain: Project → Settings → Domains → add yours and follow the DNS steps.

## Option B — Netlify

1. netlify.com, sign in with GitHub.
2. **Add new site → Import an existing project**, pick `tranche`.
3. `netlify.toml` provides the build command and publish dir. Deploy.
4. *Or* skip git entirely for a quick test: run `npm run build` locally and
   drag the `dist` folder onto the Netlify dashboard.

## Option C — GitHub Pages (everything stays on GitHub)

A workflow is already included at `.github/workflows/deploy.yml`.

1. On GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions.**
2. Push to `main`. The Action builds with `BASE_PATH=/tranche/` and deploys.
3. Your site appears at `https://<your-username>.github.io/tranche/`.

If you later add a custom domain or rename the repo, update `BASE_PATH` in
the workflow (use `/` for a root/custom-domain deploy).

## Option D — Cloudflare Pages

1. dash.cloudflare.com → Workers & Pages → Create → Pages → connect repo.
2. Build command `npm run build`, output directory `dist`. Deploy.

---

## A note on the `base` path (why blank pages happen)

`vite.config.js` reads `BASE_PATH` (default `/`). Root-domain hosts (Vercel,
Netlify, Cloudflare, any custom domain) need `/`. GitHub Pages project sites
serve from a subpath like `/tranche/`, which is why only the Pages workflow
sets `BASE_PATH`. If you ever see a deployed page load blank with 404s on the
JS/CSS, the base path is the culprit.

---

## Mobile (Play Store / App Store) — later, not now

Do this only after the web app has run for a while with your real readings.
The path, per `docs/ROADMAP.md`, is Capacitor wrapping this same build:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/preferences
npx cap init Tranche com.<you>.tranche --web-dir=dist
npm run build && npx cap add android   # and/or: npx cap add ios
npx cap open android                   # opens Android Studio to build the APK/AAB
```

Then swap `src/lib/storage.js` to use `@capacitor/preferences` instead of
localStorage (it's the only file that changes — that's the whole point of the
storage adapter).

Real-world gates to budget for:
- **Google Play**: one-time $25 developer account.
- **Apple App Store**: $99/year, and building iOS requires a Mac with Xcode
  (or a cloud-Mac service).
- **Review**: finance-adjacent apps get extra scrutiny. Keep the
  "educational, not financial advice" disclaimer prominent — it already is,
  in the footer and README, for exactly this reason.
- **Local notifications** (`@capacitor/local-notifications`) cover "record
  today's reading" and backstop-date reminders on-device, no server needed.
  True trigger-level push alerts are best handled by your broker's free price
  alerts rather than building a backend to watch market closes.

Ship to a URL this week. Ship to stores only once the rules have survived
contact with real market days.
