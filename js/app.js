/* Namaz Times BD — UI logic. Depends on PrayTimes (js/prayer.js) and CITIES (js/cities.js). */
(function () {
  'use strict';

  var PT = window.PrayTimes;
  var TZ = 6; // Asia/Dhaka, no DST

  var I18N = {
    en: {
      appName: 'Namaz Times BD', tagline: 'Prayer times for Bangladesh', install: 'Install',
      tabToday: 'Today', tabMonth: 'Month', tabQibla: 'Qibla', tabSettings: 'Settings',
      useGps: '📍 Use GPS', nextPrayer: 'Next prayer', inProgress: 'now',
      calcNote: "Times are computed astronomically for your city. Verify with your local mosque for Jama'ah times.",
      day: 'Day', pFajr: 'Fajr', pSunrise: 'Sunrise', pDhuhr: 'Dhuhr', pAsr: 'Asr', pMaghrib: 'Maghrib', pIsha: 'Isha',
      copy: '📋 Copy', print: '🖨 Print', copied: 'Copied to clipboard',
      fromNorth: 'from true north', qiblaHint: 'Face the green arrow. On phones, tap "Use compass" to rotate with your device.',
      enableCompass: '🧭 Use compass', compassOn: 'Compass active — rotate your phone.', compassDenied: 'Compass not available on this device.',
      calculation: 'Calculation', method: 'Method', asrSchool: 'Asr juristic method',
      hanafi: "Hanafi (later Asr)", shafii: "Shafi'i / Maliki / Hanbali",
      customCoords: 'Custom coordinates (overrides city)', coordsHint: 'Leave empty to use the selected city.',
      clear: 'Clear', clock: 'Clock', clock12: '12-hour', clock24: '24-hour',
      reminders: 'Prayer reminders', reminderNote: 'Notifications appear while this page is open. Times are recomputed daily.',
      enableReminders: 'Enable reminders', about: 'About',
      aboutText: 'Namaz Times BD computes prayer times from real solar-position math — no internet needed after first load. v1.0.0.',
      footerNote: "Computed offline · Verify with your local mosque",
      gpsFound: 'Location found', gpsFail: 'Could not get location', invalidCoords: 'Enter valid latitude (-90..90) and longitude (-180..180).',
      notifyTitle: 'Prayer time', notifyBody: 'It is now time for', notifyBlocked: 'Notifications blocked — allow them in your browser settings.',
      nowIn: 'in', hrs: 'h', min: 'm', sec: 's', now: 'now',
      prayerNames: { Fajr: 'Fajr', Sunrise: 'Sunrise', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' },
      monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December']
    },
    bn: {
      appName: 'নামাজ টাইমস বিডি', tagline: 'বাংলাদেশের নামাজের সময়সূচি', install: 'ইনস্টল',
      tabToday: 'আজ', tabMonth: 'মাস', tabQibla: 'কিবলা', tabSettings: 'সেটিংস',
      useGps: '📍 জিপিএস ব্যবহার করুন', nextPrayer: 'পরবর্তী নামাজ', inProgress: 'চলছে',
      calcNote: 'আপনার শহরের জন্য জ্যোতির্বিজ্ঞানভিত্তিক গণনা করা সময়। জামাতের সময়ের জন্য স্থানীয় মসজিদের সাথে যাচাই করুন।',
      day: 'তারিখ', pFajr: 'ফজর', pSunrise: 'সূর্যোদয়', pDhuhr: 'যোহর', pAsr: 'আসর', pMaghrib: 'মাগরিব', pIsha: 'এশা',
      copy: '📋 কপি', print: '🖨 প্রিন্ট', copied: 'ক্লিপবোর্ডে কপি হয়েছে',
      fromNorth: 'উত্তর থেকে', qiblaHint: 'সবুজ তীরের দিকে মুখ করুন। ফোনে "কম্পাস ব্যবহার করুন" চাপুন।',
      enableCompass: '🧭 কম্পাস ব্যবহার করুন', compassOn: 'কম্পাস চালু — ফোন ঘোরান।', compassDenied: 'এই ডিভাইসে কম্পাস নেই।',
      calculation: 'গণনা পদ্ধতি', method: 'পদ্ধতি', asrSchool: 'আসরের ফিকহি পদ্ধতি',
      hanafi: 'হানাফি (দেরিতে আসর)', shafii: "শাফি'ঈ / মালিকি / হাম্বলি",
      customCoords: 'নিজস্ব স্থানাঙ্ক (শহর বাদ দেবে)', coordsHint: 'খালি রাখলে নির্বাচিত শহর ব্যবহার হবে।',
      clear: 'মুছুন', clock: 'ঘড়ি', clock12: '১২-ঘণ্টা', clock24: '২৪-ঘণ্টা',
      reminders: 'নামাজের রিমাইন্ডার', reminderNote: 'এই পেজ খোলা থাকলে নোটিফিকেশন আসবে। প্রতিদিন সময় পুনর্গণনা হয়।',
      enableReminders: 'রিমাইন্ডার চালু করুন', about: 'সম্পর্কে',
      aboutText: 'নামাজ টাইমস বিডি বাস্তব সৌর-অবস্থান গণিত থেকে নামাজের সময় বের করে — প্রথম লোডের পর ইন্টারনেট লাগে না। v1.0.0।',
      footerNote: 'অফলাইনে গণনা করা · স্থানীয় মসজিদের সাথে যাচাই করুন',
      gpsFound: 'অবস্থান পাওয়া গেছে', gpsFail: 'অবস্থান পাওয়া যায়নি', invalidCoords: 'সঠিক অক্ষাংশ (-90..90) ও দ্রাঘিমাংশ (-180..180) দিন।',
      notifyTitle: 'নামাজের সময়', notifyBody: 'এখন সময়', notifyBlocked: 'নোটিফিকেশন বন্ধ আছে — ব্রাউজার সেটিংসে অনুমতি দিন।',
      nowIn: '', hrs: 'ঘ', min: 'মি', sec: 'সে', now: 'এখন',
      prayerNames: { Fajr: 'ফজর', Sunrise: 'সূর্যোদয়', Dhuhr: 'যোহর', Asr: 'আসর', Maghrib: 'মাগরিব', Isha: 'এশা' },
      monthNames: ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর']
    }
  };

  var BN_DIGITS = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
  function bnDigits(s) { return String(s).replace(/[0-9]/g, function (d) { return BN_DIGITS[d]; }); }

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('ntbd:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ntbd:' + k, JSON.stringify(v)); } catch (e) {} }
  };

  var settings = Object.assign({
    lang: 'en', cityId: 'dhaka', method: 'MWL', asr: 'hanafi',
    clock24: false, lat: null, lon: null,
    notifyEnabled: false, notifyFor: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true }
  }, store.get('settings', {}));

  var state = { monthCursor: new Date(), notifiedFor: {}, countdownTimer: null };

  function t(key) { return I18N[settings.lang][key]; }
  function prayerName(p) { return I18N[settings.lang].prayerNames[p]; }

  function getLocation() {
    if (settings.lat !== null && settings.lon !== null) {
      return { lat: settings.lat, lon: settings.lon, label: settings.lat.toFixed(2) + ', ' + settings.lon.toFixed(2) };
    }
    var city = CITIES.filter(function (c) { return c.id === settings.cityId; })[0] || CITIES[0];
    return { lat: city.lat, lon: city.lon, label: settings.lang === 'bn' ? city.bn : city.name };
  }

  function getOpts() { return { method: settings.method, asr: settings.asr }; }
  function todayTimes() { return PT.getTimes(new Date(), getLocation().lat, getLocation().lon, TZ, getOpts()); }
  function fmt(h) {
    var s = PT.formatTime(h, settings.clock24);
    return settings.lang === 'bn' ? bnDigits(s) : s;
  }
  function fmtDur(hours) {
    var total = Math.max(0, Math.round(hours * 3600));
    var h = Math.floor(total / 3600), m = Math.floor(total % 3600 / 60), s = total % 60;
    var parts = [];
    if (h > 0) parts.push(h + t('hrs'));
    parts.push(String(m).padStart(2, '0') + t('min'));
    parts.push(String(s).padStart(2, '0') + t('sec'));
    var str = parts.join(' ');
    return settings.lang === 'bn' ? bnDigits(str) : str;
  }

  function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  // ---------- i18n ----------
  function applyLang() {
    document.documentElement.lang = settings.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (I18N[settings.lang][key] !== undefined) el.textContent = I18N[settings.lang][key];
    });
    document.getElementById('langToggle').textContent = settings.lang === 'en' ? 'বাং' : 'EN';
    renderCityOptions(); renderMethodOptions(); renderToday(); renderMonth(); renderQibla(); renderSettings();
    updateHijri();
  }

  function renderCityOptions() {
    var sel = document.getElementById('citySelect');
    sel.innerHTML = '';
    CITIES.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c.id;
      o.textContent = (settings.lang === 'bn' ? c.bn : c.name) + ' — ' + c.division;
      if (c.id === settings.cityId) o.selected = true;
      sel.appendChild(o);
    });
  }

  function renderMethodOptions() {
    var sel = document.getElementById('methodSelect');
    sel.innerHTML = '';
    Object.keys(PT.METHODS).forEach(function (k) {
      var o = document.createElement('option');
      o.value = k; o.textContent = PT.METHODS[k].name;
      if (k === settings.method) o.selected = true;
      sel.appendChild(o);
    });
  }

  // ---------- Today ----------
  function renderToday() {
    var loc = getLocation();
    var times = todayTimes();
    var now = new Date();
    var nowH = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    var np = PT.nextPrayer(times, nowH);

    var dStr = now.toLocaleDateString(settings.lang === 'bn' ? 'bn-BD' : 'en-GB',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('dateLine').textContent = dStr + ' · ' + loc.label;

    document.getElementById('nextPrayerName').textContent = prayerName(np.next);
    document.getElementById('ringNextName').textContent = prayerName(np.next);
    var curLine = np.current ? prayerName(np.current) + ' ' + t('inProgress') : '—';
    document.getElementById('currentPrayerLine').textContent = curLine;

    var ul = document.getElementById('timesList');
    ul.innerHTML = '';
    ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(function (p) {
      var li = document.createElement('li');
      if (p === np.next) li.classList.add('next');
      var name = document.createElement('span');
      name.className = 'p-name';
      name.textContent = prayerName(p);
      if (p === np.next) {
        var tag = document.createElement('span');
        tag.className = 'p-note';
        tag.textContent = '• ' + t('nextPrayer');
        name.appendChild(tag);
      }
      var tm = document.createElement('span');
      tm.className = 'p-time';
      tm.textContent = fmt(times[p]);
      li.appendChild(name); li.appendChild(tm);
      ul.appendChild(li);
    });

    clearInterval(state.countdownTimer);
    tickCountdown(times, np);
    state.countdownTimer = setInterval(function () { tickCountdown(todayTimes(), null); }, 1000);
  }

  function tickCountdown(times, npHint) {
    var now = new Date();
    var nowH = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    var np = npHint || PT.nextPrayer(times, nowH);
    document.getElementById('ringCountdown').textContent = fmtDur(np.inHours);
    // ring progress: fraction of interval elapsed since previous prayer
    var order = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    var idx = order.indexOf(np.next);
    var startH = idx === 0 ? times.Isha - 24 : times[order[idx - 1]];
    var endH = idx === 0 ? times.Fajr : times[np.next];
    var nowAdj = nowH < startH ? nowH + 24 : nowH;
    var frac = Math.min(1, Math.max(0, (nowAdj - startH) / (endH - startH)));
    var circ = 326.7;
    document.getElementById('ringFg').style.strokeDashoffset = circ * (1 - frac);
    checkReminder(np);
  }

  // ---------- Reminders ----------
  function checkReminder(np) {
    if (!settings.notifyEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;
    if (np.inHours > 0.008) return; // ~30s window
    var key = np.next + ':' + new Date().toDateString();
    if (state.notifiedFor[key]) return;
    state.notifiedFor[key] = true;
    if (settings.notifyFor[np.next] !== false) {
      new Notification(t('notifyTitle') + ' — ' + prayerName(np.next), { body: t('notifyBody') + ' ' + prayerName(np.next) });
    }
  }

  function renderSettings() {
    document.getElementById('methodSelect').value = settings.method;
    document.getElementById('asrSelect').value = settings.asr;
    document.getElementById('clockSelect').value = settings.clock24 ? '24' : '12';
    document.getElementById('latInput').value = settings.lat === null ? '' : settings.lat;
    document.getElementById('lonInput').value = settings.lon === null ? '' : settings.lon;
    var sw = document.getElementById('notifyToggle');
    sw.setAttribute('aria-checked', settings.notifyEnabled ? 'true' : 'false');
    var list = document.getElementById('reminderList');
    list.innerHTML = '';
    ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(function (p) {
      var row = document.createElement('label');
      row.className = 'switch-row';
      var lbl = document.createElement('span'); lbl.textContent = prayerName(p);
      var b = document.createElement('button');
      b.className = 'switch'; b.setAttribute('role', 'switch');
      b.setAttribute('aria-checked', settings.notifyFor[p] !== false ? 'true' : 'false');
      b.innerHTML = '<span class="knob"></span>';
      b.addEventListener('click', function (e) {
        e.preventDefault();
        var on = b.getAttribute('aria-checked') !== 'true';
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        settings.notifyFor[p] = on; save();
      });
      row.appendChild(lbl); row.appendChild(b);
      list.appendChild(row);
    });
  }

  // ---------- Month ----------
  function renderMonth() {
    var loc = getLocation();
    var y = state.monthCursor.getFullYear(), m = state.monthCursor.getMonth();
    document.getElementById('monthTitle').textContent =
      I18N[settings.lang].monthNames[m] + ' ' + (settings.lang === 'bn' ? bnDigits(y) : y);
    var rows = PT.getMonthTimes(y, m, loc.lat, loc.lon, TZ, getOpts());
    var tb = document.querySelector('#monthTable tbody');
    tb.innerHTML = '';
    var today = new Date();
    rows.forEach(function (r, i) {
      var tr = document.createElement('tr');
      if (y === today.getFullYear() && m === today.getMonth() && i + 1 === today.getDate()) tr.classList.add('today');
      var cells = [i + 1, 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(function (k, ci) {
        var td = document.createElement('td');
        td.textContent = ci === 0 ? (settings.lang === 'bn' ? bnDigits(k) : k) : fmt(r[k]);
        return td;
      });
      cells.forEach(function (c) { tr.appendChild(c); });
      tb.appendChild(tr);
    });
  }

  function monthAsText() {
    var loc = getLocation();
    var y = state.monthCursor.getFullYear(), m = state.monthCursor.getMonth();
    var rows = PT.getMonthTimes(y, m, loc.lat, loc.lon, TZ, getOpts());
    var lines = [document.getElementById('monthTitle').textContent + ' — ' + loc.label,
      'Day\tFajr\tSunrise\tDhuhr\tAsr\tMaghrib\tIsha'];
    rows.forEach(function (r, i) {
      lines.push([i + 1, PT.formatTime(r.Fajr, true), PT.formatTime(r.Sunrise, true),
        PT.formatTime(r.Dhuhr, true), PT.formatTime(r.Asr, true),
        PT.formatTime(r.Maghrib, true), PT.formatTime(r.Isha, true)].join('\t'));
    });
    return lines.join('\n');
  }

  // ---------- Qibla ----------
  function renderQibla() {
    var loc = getLocation();
    var b = PT.qiblaBearing(loc.lat, loc.lon);
    document.getElementById('qiblaDeg').textContent = settings.lang === 'bn' ? bnDigits(b.toFixed(1)) : b.toFixed(1);
    document.getElementById('qiblaArrow').style.transform =
      'translateX(-50%) rotate(' + b.toFixed(1) + 'deg)';
    document.getElementById('qiblaArrow').style.transformOrigin = '50% 115px';
  }

  var compassWatch = null;
  function enableCompass() {
    var status = document.getElementById('compassStatus');
    function onHeading(deg) {
      // rotate face so device heading points up; qibla arrow stays fixed
      document.querySelector('.compass-face').style.transform = 'rotate(' + (-deg).toFixed(1) + 'deg)';
    }
    function fail() { status.textContent = t('compassDenied'); }
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(function (res) {
        if (res === 'granted') startOrientation(onHeading, fail);
        else fail();
      }).catch(fail);
    } else if ('DeviceOrientationEvent' in window) {
      startOrientation(onHeading, fail);
    } else fail();
  }
  function startOrientation(onHeading, fail) {
    var got = false;
    var handler = function (e) {
      var deg = e.webkitCompassHeading !== undefined ? e.webkitCompassHeading : (e.alpha !== null ? 360 - e.alpha : null);
      if (deg === null || deg === undefined) { fail(); window.removeEventListener('deviceorientation', handler); return; }
      got = true; onHeading(deg);
    };
    window.addEventListener('deviceorientation', handler);
    document.getElementById('compassStatus').textContent = t('compassOn');
    setTimeout(function () { if (!got) fail(); }, 4000);
  }

  // ---------- Hijri ----------
  function updateHijri() {
    try {
      var h = new Intl.DateTimeFormat(settings.lang === 'bn' ? 'bn-BD-u-ca-islamic' : 'en-u-ca-islamic',
        { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
      document.getElementById('hijriLine').textContent = h;
    } catch (e) { document.getElementById('hijriLine').textContent = '—'; }
  }

  function save() { store.set('settings', settings); }

  // ---------- Events ----------
  function bind() {
    document.querySelectorAll('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(function (x) {
          x.classList.remove('active'); x.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      });
    });

    document.getElementById('langToggle').addEventListener('click', function () {
      settings.lang = settings.lang === 'en' ? 'bn' : 'en'; save(); applyLang();
    });

    document.getElementById('citySelect').addEventListener('change', function (e) {
      settings.cityId = e.target.value; save(); renderToday(); renderMonth(); renderQibla();
    });

    document.getElementById('locateBtn').addEventListener('click', function () {
      if (!navigator.geolocation) { toast(t('gpsFail')); return; }
      navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude, lon = pos.coords.longitude;
        var best = CITIES[0], bd = Infinity;
        CITIES.forEach(function (c) {
          var d = Math.hypot(c.lat - lat, c.lon - lon);
          if (d < bd) { bd = d; best = c; }
        });
        settings.cityId = best.id; settings.lat = null; settings.lon = null; save();
        renderCityOptions(); renderToday(); renderMonth(); renderQibla(); renderSettings();
        toast(t('gpsFound') + ': ' + (settings.lang === 'bn' ? best.bn : best.name));
      }, function () { toast(t('gpsFail')); }, { timeout: 10000 });
    });

    document.getElementById('monthPrev').addEventListener('click', function () {
      state.monthCursor.setMonth(state.monthCursor.getMonth() - 1); renderMonth();
    });
    document.getElementById('monthNext').addEventListener('click', function () {
      state.monthCursor.setMonth(state.monthCursor.getMonth() + 1); renderMonth();
    });
    document.getElementById('copyMonthBtn').addEventListener('click', function () {
      var txt = monthAsText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { toast(t('copied')); }, function () { fallbackCopy(txt); });
      } else fallbackCopy(txt);
    });
    function fallbackCopy(txt) {
      var ta = document.createElement('textarea');
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast(t('copied')); } catch (e) {}
      document.body.removeChild(ta);
    }
    document.getElementById('printMonthBtn').addEventListener('click', function () { window.print(); });

    document.getElementById('compassBtn').addEventListener('click', enableCompass);

    document.getElementById('methodSelect').addEventListener('change', function (e) {
      settings.method = e.target.value; save(); renderToday(); renderMonth();
    });
    document.getElementById('asrSelect').addEventListener('change', function (e) {
      settings.asr = e.target.value; save(); renderToday(); renderMonth();
    });
    document.getElementById('clockSelect').addEventListener('change', function (e) {
      settings.clock24 = e.target.value === '24'; save(); renderToday(); renderMonth();
    });
    document.getElementById('clearCoordsBtn').addEventListener('click', function () {
      settings.lat = null; settings.lon = null; save();
      renderSettings(); renderToday(); renderMonth(); renderQibla();
    });
    ['latInput', 'lonInput'].forEach(function (id) {
      document.getElementById(id).addEventListener('change', function () {
        var lat = parseFloat(document.getElementById('latInput').value);
        var lon = parseFloat(document.getElementById('lonInput').value);
        var latOk = !isNaN(lat) && lat >= -90 && lat <= 90;
        var lonOk = !isNaN(lon) && lon >= -180 && lon <= 180;
        var bothEmpty = document.getElementById('latInput').value === '' && document.getElementById('lonInput').value === '';
        if (bothEmpty) { settings.lat = null; settings.lon = null; }
        else if (latOk && lonOk) { settings.lat = lat; settings.lon = lon; }
        else { toast(t('invalidCoords')); renderSettings(); return; }
        save(); renderToday(); renderMonth(); renderQibla();
      });
    });

    document.getElementById('notifyToggle').addEventListener('click', function () {
      var want = this.getAttribute('aria-checked') !== 'true';
      if (want && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(function (perm) {
          if (perm === 'granted') { settings.notifyEnabled = true; }
          else toast(t('notifyBlocked'));
          save(); renderSettings();
        });
      } else if (want && (!('Notification' in window) || Notification.permission === 'denied')) {
        toast(t('notifyBlocked'));
      } else {
        settings.notifyEnabled = want;
      }
      save(); renderSettings();
    });

    // PWA install prompt
    var deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault(); deferredPrompt = e;
      document.getElementById('installBtn').classList.remove('hidden');
    });
    document.getElementById('installBtn').addEventListener('click', function () {
      if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; }
      this.classList.add('hidden');
    });
  }

  document.addEventListener('DOMContentLoaded', function () { bind(); applyLang(); });
})();
