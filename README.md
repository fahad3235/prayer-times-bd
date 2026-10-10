# 🕌 Namaz Times BD

Accurate daily prayer times for Bangladesh — computed on-device from real solar-position mathematics. No account, no tracking, no internet required after the first load.

![Status](https://img.shields.io/badge/status-v1.0.0-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![Tests](https://img.shields.io/badge/tests-19%2B7%20passing-brightgreen)

## Problem

Prayer-time apps for Bangladesh are usually ad-heavy, require accounts, and break offline. Mosque timetables differ by city, and most apps get Asr wrong for the Hanafi school followed by the majority of Bangladeshi Muslims.

## Features

1. **Daily prayer times** — Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha computed astronomically for your city (UTC+6).
2. **16 cities + GPS + custom coordinates** — pick a city, snap to the nearest one via GPS, or enter any latitude/longitude.
3. **Live next-prayer countdown** — ring progress between prayers, updates every second.
4. **Monthly timetable** — full month for your city; copy as text or print.
5. **Qibla compass** — great-circle bearing to the Kaaba (21.4225°N, 39.8262°E); rotates with your phone's compass where available.
6. **Calculation settings** — 6 conventions (MWL, Karachi, ISNA, Egypt, Umm al-Qura, Jafari) + Hanafi/Shafi'i Asr + 12/24-hour clock.
7. **Prayer reminders** — per-prayer notification toggles (fires while the page is open).
8. **Bilingual EN/বাংলা UI** + Hijri date, installable PWA (works fully offline via service worker).

## Stack

Vanilla HTML + CSS + JavaScript. Zero dependencies, zero build step.

```
index.html          UI shell (4 tabs)
css/styles.css      dark-green/gold theme, responsive, print stylesheet
js/prayer.js        solar-position math (UMD: browser + Node)
js/cities.js        16 BD cities, WGS84 coords (UMD)
js/app.js           state, i18n, countdown, reminders, compass
js/sw.js            offline service worker
manifest.json       PWA manifest
icons/icon.svg      app icon (SVG)
tests/prayer.test.js  Node unit + live-reference tests
tests/smoke.sh        headless-Chrome DOM smoke test
```

## Prerequisites

Any static file server (or just open `index.html` — service worker needs `http(s)`). Node.js ≥ 18 for tests.

## Install / run

```bash
# serve locally
python3 -m http.server 8000        # then open http://localhost:8000
# or
npx serve .
```

## Dev commands

```bash
npm test          # 19 unit checks (Node), incl. live comparison vs Aladhan API
npm run test:smoke  # headless-Chrome DOM smoke test (7 checks)
```

## How the math works

For each date the Julian day is computed, then solar declination δ and the equation of time from standard astronomical series. Prayer times follow from hour angles:

- Fajr/Isha — sun 18°/17° below horizon (MWL default)
- Sunrise/Maghrib — sun 0.833° below horizon
- Dhuhr — solar noon (equation-of-time corrected)
- Asr — shadow-length method: Hanafi shadow = 2× object + noon shadow, Shafi'i = 1×

Times are shifted by `UTC+6 − longitude/15` for Bangladesh.

## Testing

- `tests/prayer.test.js` — 19 checks: ordering/sanity bounds, **live agreement with the [Aladhan API](https://aladhan.com/prayer-times-api) (all 6 prayers within 4 min for Dhaka, 2026-10-10)**, Hanafi > Shafi'i Asr, Qibla ≈ 277.6° for Dhaka, 31-row October timetable, `nextPrayer` edge cases, convention differences. **Result: 19/19 PASS.**
- `tests/smoke.sh` — renders in headless Chromium: title, 6 prayer rows with real times (e.g. Fajr 4:38 AM, Sunrise 5:53 AM, Dhuhr 11:45 AM), live countdown, full month table (31 day rows incl. today highlight), Qibla bearing, city selector; zero console errors. **Result: 7/7 PASS.**

## Deployment

Any static host: Netlify Drop, GitHub Pages, Vercel, or nginx. No server code, no env vars, no secrets.

## Limitations

- **Not a fatwa, not a mosque timetable.** Times are astronomical; always confirm Jama'ah times with your local mosque. Dhuhr here is solar noon, not the mosque's announced time.
- Reminders only fire while the page/tab is open (Web Notifications, no background service).
- City coordinates are district-HQ approximations (~1 km); use custom coordinates for exact spots.
- Hijri date uses the browser's built-in Islamic calendar — moon-sighting differences may apply.

## Status

v1.0.0 — complete MVP, all tests passing.

## Attribution

City coordinates: public gazetteer data; Cumilla cross-checked against [bayeziddev/bangladesh-geocode](https://github.com/bayeziddev/bangladesh-geocode) (MIT).
