/* PrayTime math: UMD module (browser + Node).
 * Implements the standard solar-position prayer-time algorithm:
 *   solar declination + equation of time from the Julian date,
 *   hour angles for each prayer angle, shadow-length method for Asr.
 * All times returned as decimal hours in the requested UTC offset.
 * No network calls, no dependencies. */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PrayTimes = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var D2R = Math.PI / 180;
  var R2D = 180 / Math.PI;

  // Calculation conventions (angles in degrees below horizon; Asr shadow factor)
  var METHODS = {
    MWL:     { name: 'Muslim World League', fajr: 18,   isha: 17,   maghrib: 0.833, asr: 1 },
    Karachi: { name: 'Karachi (Univ. of Islamic Sciences)', fajr: 18, isha: 18, maghrib: 0.833, asr: 1 },
    ISNA:    { name: 'ISNA (North America)', fajr: 15,   isha: 15,   maghrib: 0.833, asr: 1 },
    Egypt:   { name: 'Egyptian General Authority', fajr: 19.5, isha: 17.5, maghrib: 0.833, asr: 1 },
    Makkah:  { name: 'Umm al-Qura (Makkah)', fajr: 18.5, isha: 18.5, maghrib: 0.833, asr: 1 },
    Jafari:  { name: "Shia Ithna-Ansari (Jafari)", fajr: 16, isha: 14, maghrib: 4, asr: 2 }
  };

  var PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  function fixAngle(a) { return a - 360 * Math.floor(a / 360); }
  function fixHour(h) { return h - 24 * Math.floor(h / 24); }

  // Julian date for a calendar date at noon UTC
  function julianDate(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100);
    var B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }

  // Sun declination + equation of time (hours) for a Julian date
  function sunPosition(jd) {
    var D = jd - 2451545.0;
    var g = fixAngle(357.529 + 0.98560028 * D);
    var q = fixAngle(280.459 + 0.98564736 * D);
    var L = fixAngle(q + 1.915 * Math.sin(g * D2R) + 0.020 * Math.sin(2 * g * D2R));
    var e = 23.439 - 0.00000036 * D;
    var RA = fixHour(Math.atan2(Math.cos(e * D2R) * Math.sin(L * D2R), Math.cos(L * D2R)) * R2D / 15);
    return {
      declination: Math.asin(Math.sin(e * D2R) * Math.sin(L * D2R)) * R2D,
      equation: fixHour(q / 15 - RA)
    };
  }

  function midDay(jd, t) {
    return fixHour(12 - sunPosition(jd + t).equation);
  }

  // Time when the sun reaches a given depression angle (morning: ccw, evening: cw)
  function sunAngleTime(jd, lat, angle, t, direction) {
    var D = sunPosition(jd + t).declination;
    var Z = midDay(jd, t);
    var beg = -Math.sin(angle * D2R) - Math.sin(D * D2R) * Math.sin(lat * D2R);
    var mid = Math.cos(D * D2R) * Math.cos(lat * D2R);
    var ratio = Math.min(1, Math.max(-1, beg / mid));
    var V = Math.acos(ratio) * R2D / 15;
    return Z + (direction === 'ccw' ? -V : V);
  }

  // Asr: sun altitude whose shadow length = factor + shadow at noon
  function asrTime(jd, lat, factor, t) {
    var D = sunPosition(jd + t).declination;
    var G = -Math.atan(1 / (factor + Math.tan(Math.abs(lat - D) * D2R))) * R2D;
    return sunAngleTime(jd, lat, G, t, 'cw');
  }

  /**
   * Compute prayer times.
   * @param {Date} date - local calendar date (time-of-day ignored)
   * @param {number} lat - latitude, degrees
   * @param {number} lon - longitude, degrees
   * @param {number} utcOffset - hours east of UTC (Bangladesh = +6)
   * @param {object} opts - {method:'MWL'|'Karachi'|'ISNA'|'Egypt'|'Makkah'|'Jafari', asr:'shafii'|'hanafi', adjust:{Fajr:..}}
   * @returns {object} {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha} in decimal local hours + dateISO
   */
  function getTimes(date, lat, lon, utcOffset, opts) {
    opts = opts || {};
    var m = METHODS[opts.method] || METHODS.MWL;
    var asrFactor = opts.asr === 'hanafi' ? 2 : (opts.asr === 'shafii' ? 1 : m.asr);
    var jd = julianDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) - lon / (15 * 24);
    var t = { Fajr: 5 / 24, Sunrise: 6 / 24, Dhuhr: 12 / 24, Asr: 13 / 24, Maghrib: 18 / 24, Isha: 18 / 24 };
    var lngHour = lon / 15;

    var times = {};
    times.Fajr = sunAngleTime(jd, lat, m.fajr, t.Fajr, 'ccw');
    times.Sunrise = sunAngleTime(jd, lat, 0.833, t.Sunrise, 'ccw');
    times.Dhuhr = midDay(jd, t.Dhuhr);
    times.Asr = asrTime(jd, lat, asrFactor, t.Asr);
    times.Maghrib = sunAngleTime(jd, lat, m.maghrib, t.Maghrib, 'cw');
    times.Isha = sunAngleTime(jd, lat, m.isha, t.Isha, 'cw');

    var adjust = opts.adjust || {};
    Object.keys(times).forEach(function (p) {
      times[p] = fixHour(times[p] + utcOffset - lngHour + (adjust[p] || 0) / 60);
    });
    times.dateISO = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    return times;
  }

  // Full month timetable: array of getTimes results for each day
  function getMonthTimes(year, month, lat, lon, utcOffset, opts) {
    var days = new Date(year, month + 1, 0).getDate();
    var out = [];
    for (var d = 1; d <= days; d++) out.push(getTimes(new Date(year, month, d), lat, lon, utcOffset, opts));
    return out;
  }

  // Qibla bearing from (lat, lon) to the Kaaba, degrees clockwise from true north
  function qiblaBearing(lat, lon) {
    var K_LAT = 21.4225, K_LON = 39.8262;
    var dLon = (K_LON - lon) * D2R;
    var y = Math.sin(dLon) * Math.cos(K_LAT * D2R);
    var x = Math.cos(lat * D2R) * Math.sin(K_LAT * D2R) -
            Math.sin(lat * D2R) * Math.cos(K_LAT * D2R) * Math.cos(dLon);
    return fixAngle(Math.atan2(y, x) * R2D);
  }

  // Decimal hours -> "h:mm AM/PM" or "HH:MM"
  function formatTime(h, use24) {
    h = fixHour(h);
    var H = Math.floor(h), M = Math.floor((h - H) * 60 + 0.5);
    if (M === 60) { M = 0; H = (H + 1) % 24; }
    if (use24) return String(H).padStart(2, '0') + ':' + String(M).padStart(2, '0');
    var ap = H < 12 ? 'AM' : 'PM', h12 = H % 12 === 0 ? 12 : H % 12;
    return h12 + ':' + String(M).padStart(2, '0') + ' ' + ap;
  }

  // Find current/next prayer given times (decimal hours) and "now" (decimal hours)
  function nextPrayer(times, nowH) {
    var order = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    for (var i = 0; i < order.length; i++) {
      if (nowH < times[order[i]]) return { current: i === 0 ? null : order[i - 1], next: order[i], inHours: times[order[i]] - nowH };
    }
    return { current: 'Isha', next: 'Fajr', inHours: 24 - nowH + times.Fajr };
  }

  return {
    METHODS: METHODS, PRAYERS: PRAYERS,
    getTimes: getTimes, getMonthTimes: getMonthTimes,
    qiblaBearing: qiblaBearing, formatTime: formatTime, nextPrayer: nextPrayer
  };
});
