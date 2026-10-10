/* Node test suite for js/prayer.js. Run: node tests/prayer.test.js
 * Exits 0 on success, 1 on any failure. Prints PASS/FAIL per check. */
'use strict';
const PT = require('../js/prayer.js');

let failures = 0;
function check(name, cond, detail) {
  if (cond) console.log('PASS  ' + name);
  else { failures++; console.log('FAIL  ' + name + (detail ? ' — ' + detail : '')); }
}
const h2m = (h) => Math.round(h * 60);

(async () => {
  // --- 1. Ordering + sanity: Dhaka, 2026-10-10, MWL/Hanafi (Bangladesh default) ---
  const dhaka = { lat: 23.81, lon: 90.41 };
  const date = new Date(2026, 9, 10);
  const t = PT.getTimes(date, dhaka.lat, dhaka.lon, 6, { method: 'MWL', asr: 'hanafi' });
  const order = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  let ordered = true;
  for (let i = 1; i < order.length; i++) if (!(t[order[i - 1]] < t[order[i]])) ordered = false;
  check('prayer order Fajr<Sunrise<Dhuhr<Asr<Maghrib<Isha (Dhaka 2026-10-10)', ordered,
    JSON.stringify(order.map((p) => [p, PT.formatTime(t[p], true)])));
  check('Fajr in morning (4:00-6:00)', t.Fajr > 4 && t.Fajr < 6, PT.formatTime(t.Fajr, true));
  check('Maghrib in evening (17:00-19:00)', t.Maghrib > 17 && t.Maghrib < 19, PT.formatTime(t.Maghrib, true));
  check('Dhuhr near noon (11:30-12:45)', t.Dhuhr > 11.5 && t.Dhuhr < 12.75, PT.formatTime(t.Dhuhr, true));

  // --- 2. Live reference: Aladhan API (free, no key), method=3 (MWL) ---
  // Tolerance ±4 min (different rounding conventions are normal).
  try {
    const res = await fetch('https://api.aladhan.com/v1/timings/10-10-2026?latitude=23.81&longitude=90.41&method=3');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const ref = data.data.timings;
    const toH = (s) => { const [H, M] = s.split(':').map(Number); return H + M / 60; };
  // Aladhan method=3 defaults to Shafii Asr -> compare like-with-like.
  const tShafii = PT.getTimes(date, dhaka.lat, dhaka.lon, 6, { method: 'MWL', asr: 'shafii' });
  const tRef = { Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr, Asr: tShafii.Asr, Maghrib: t.Maghrib, Isha: t.Isha };
    const pairs = [['Fajr', 'Fajr'], ['Sunrise', 'Sunrise'], ['Dhuhr', 'Dhuhr'], ['Asr', 'Asr'], ['Maghrib', 'Maghrib'], ['Isha', 'Isha']];
    let maxDiff = 0;
    pairs.forEach(([mine, theirs]) => {
      const d = Math.abs(h2m(tRef[mine]) - h2m(toH(ref[theirs])));
      maxDiff = Math.max(maxDiff, d);
      check('Aladhan agreement: ' + mine + ' within 4 min', d <= 4,
        'mine ' + PT.formatTime(t[mine], true) + ' vs Aladhan ' + ref[theirs]);
    });
    console.log('      max deviation vs Aladhan: ' + maxDiff + ' min');
  } catch (e) {
    failures++;
    console.log('FAIL  Aladhan reference fetch — ' + e.message + ' (network required for this check)');
  }

  // --- 3. Asr schools: Hanafi strictly later than Shafii ---
  const asrH = PT.getTimes(date, dhaka.lat, dhaka.lon, 6, { method: 'MWL', asr: 'hanafi' }).Asr;
  const asrS = PT.getTimes(date, dhaka.lat, dhaka.lon, 6, { method: 'MWL', asr: 'shafii' }).Asr;
  check('Hanafi Asr later than Shafii Asr', asrH > asrS + 0.4,
    'hanafi ' + PT.formatTime(asrH, true) + ' vs shafii ' + PT.formatTime(asrS, true));

  // --- 4. Qibla: Dhaka -> Kaaba is WNW, known ~278° ---
  const q = PT.qiblaBearing(23.81, 90.41);
  check('Qibla Dhaka ≈ 278° (276–280)', q > 276 && q < 280, q.toFixed(2) + '°');

  // --- 5. Month timetable: 31 rows for Oct 2026, all valid numbers ---
  const month = PT.getMonthTimes(2026, 9, dhaka.lat, dhaka.lon, 6, { method: 'MWL', asr: 'hanafi' });
  check('October 2026 has 31 rows', month.length === 31, String(month.length));
  let allValid = true;
  month.forEach((r) => order.forEach((p) => { if (!(r[p] > 0 && r[p] < 24)) allValid = false; }));
  check('all month times are valid hours', allValid);

  // --- 6. nextPrayer logic ---
  const np1 = PT.nextPrayer(t, t.Fajr - 0.1);
  check('before Fajr -> next is Fajr', np1.next === 'Fajr', np1.next);
  const np2 = PT.nextPrayer(t, (t.Dhuhr + t.Asr) / 2);
  check('between Dhuhr and Asr -> current Dhuhr, next Asr', np2.current === 'Dhuhr' && np2.next === 'Asr',
    np2.current + '/' + np2.next);
  const np3 = PT.nextPrayer(t, t.Isha + 0.5);
  check('after Isha -> next is tomorrow Fajr', np3.next === 'Fajr' && np3.current === 'Isha', np3.next);

  // --- 7. Methods differ sensibly ---
  const isna = PT.getTimes(date, dhaka.lat, dhaka.lon, 6, { method: 'ISNA', asr: 'hanafi' });
  check('ISNA Fajr later than MWL Fajr (15° vs 18°)', isna.Fajr > t.Fajr, PT.formatTime(isna.Fajr, true));

  console.log(failures === 0 ? '\nALL TESTS PASSED' : '\n' + failures + ' TEST(S) FAILED');
  process.exit(failures === 0 ? 0 : 1);
})();
