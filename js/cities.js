/* City coordinates for prayer-time computation (WGS84, decimal degrees).
 * District HQ positions rounded to 2 decimals (~1 km); prayer times shift
 * < 1 minute per ~25 km, so this precision is ample.
 * Sources: public gazetteer data; Cumilla cross-checked against the
 * bayeziddev/bangladesh-geocode dataset (MIT). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CITIES = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var CITIES = [
    { id: 'dhaka',       name: 'Dhaka',       bn: 'ঢাকা',        lat: 23.81, lon: 90.41, division: 'Dhaka' },
    { id: 'chattogram',  name: 'Chattogram',  bn: 'চট্টগ্রাম',     lat: 22.36, lon: 91.78, division: 'Chattogram' },
    { id: 'sylhet',      name: 'Sylhet',      bn: 'সিলেট',       lat: 24.89, lon: 91.87, division: 'Sylhet' },
    { id: 'rajshahi',    name: 'Rajshahi',    bn: 'রাজশাহী',     lat: 24.37, lon: 88.60, division: 'Rajshahi' },
    { id: 'khulna',      name: 'Khulna',      bn: 'খুলনা',       lat: 22.85, lon: 89.54, division: 'Khulna' },
    { id: 'barishal',    name: 'Barishal',    bn: 'বরিশাল',      lat: 22.70, lon: 90.35, division: 'Barishal' },
    { id: 'rangpur',     name: 'Rangpur',     bn: 'রংপুর',       lat: 25.74, lon: 89.28, division: 'Rangpur' },
    { id: 'mymensingh',  name: 'Mymensingh',  bn: 'ময়মনসিংহ',    lat: 24.75, lon: 90.42, division: 'Mymensingh' },
    { id: 'cumilla',     name: 'Cumilla',     bn: 'কুমিল্লা',     lat: 23.47, lon: 91.18, division: 'Chattogram' },
    { id: 'coxsbazar',   name: "Cox's Bazar", bn: 'কক্সবাজার',    lat: 21.43, lon: 92.01, division: 'Chattogram' },
    { id: 'bogura',      name: 'Bogura',      bn: 'বগুড়া',      lat: 24.85, lon: 89.38, division: 'Rajshahi' },
    { id: 'dinajpur',    name: 'Dinajpur',    bn: 'দিনাজপুর',     lat: 25.63, lon: 88.63, division: 'Rangpur' },
    { id: 'jessore',     name: 'Jessore',     bn: 'যশোর',        lat: 23.17, lon: 89.22, division: 'Khulna' },
    { id: 'kushtia',     name: 'Kushtia',     bn: 'কুষ্টিয়া',    lat: 23.90, lon: 89.12, division: 'Khulna' },
    { id: 'noakhali',    name: 'Noakhali',    bn: 'নোয়াখালী',    lat: 22.82, lon: 91.10, division: 'Chattogram' },
    { id: 'faridpur',    name: 'Faridpur',    bn: 'ফরিদপুর',     lat: 23.61, lon: 89.84, division: 'Dhaka' }
  ];
  return CITIES;
});
