// Almanac: three cards at the top of Today for Columbia, MD — sunrise/sunset and moon phase are computed here (no network),
// weather comes from data/weather.js (written each morning by a GitHub Action).
(function () {
  "use strict";
  var H = Hub, esc = H.esc, LAT = 39.2037, LNG = -76.861, TZ = "America/New_York", PI = Math.PI, rad = PI / 180;

  // ---------- sun (NOAA-style solar position, same method as the SunCalc library) ----------
  function sunTimes(date) {
    var J1970 = 2440588, J2000 = 2451545, e = rad * 23.4397, lw = rad * -LNG, phi = rad * LAT;
    var d = date.getTime() / 864e5 - 0.5 + J1970 - J2000, n = Math.round(d - 0.0009 - lw / (2 * PI)), ds = 0.0009 + lw / (2 * PI) + n;
    var M = rad * (357.5291 + 0.98560028 * ds);
    var L = M + rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) + rad * 102.9372 + PI;
    var dec = Math.asin(Math.sin(L) * Math.sin(e));
    var jnoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    var w = Math.acos((Math.sin(-0.833 * rad) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
    var jset = J2000 + (0.0009 + (w + lw) / (2 * PI) + n) + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L), jrise = jnoon - (jset - jnoon);
    function toDate(j) { return new Date((j + 0.5 - J1970) * 864e5); }
    return { rise: toDate(jrise), set: toDate(jset) };
  }
  function clock(d) { return new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(d); }

  // ---------- moon ----------
  var SYN = 29.530588853, NEW = Date.UTC(2000, 0, 6, 18, 14);
  function moon(date) {
    var age = (((date.getTime() - NEW) / 864e5) % SYN + SYN) % SYN, f = age / SYN, illum = Math.round((1 - Math.cos(2 * PI * f)) / 2 * 100);
    var name = f < 0.0339 || f >= 0.9661 ? "New moon" : f < 0.2161 ? "Waxing crescent" : f < 0.2839 ? "First quarter" : f < 0.4661 ? "Waxing gibbous" :
      f < 0.5339 ? "Full moon" : f < 0.7161 ? "Waning gibbous" : f < 0.7839 ? "Last quarter" : "Waning crescent";
    var toFull = ((0.5 - f) * SYN + SYN) % SYN, toNew = ((1 - f) * SYN) % SYN;
    return { f: f, name: name, illum: illum, trend: f < 0.5 ? "Waxing" : "Waning", toFull: Math.round(toFull), toNew: Math.round(toNew) };
  }
  function moonSvg(f) {
    var r = 26, waxing = f < 0.5, g = waxing ? f : 1 - f, rx = (r * Math.abs(Math.cos(2 * PI * g))).toFixed(2), sweep = g < 0.25 ? 1 : 0;
    var lit = "M0 " + -r + " A" + r + " " + r + " 0 0 1 0 " + r + " A" + rx + " " + r + " 0 0 " + sweep + " 0 " + -r + "Z";
    return '<svg class="moon-svg" viewBox="-30 -30 60 60" aria-hidden="true"><circle r="' + r + '" class="moon-dark"/><path d="' + lit + '" class="moon-lit"' + (waxing ? "" : ' transform="scale(-1 1)"') + '/><circle r="' + r + '" class="moon-rim"/></svg>';
  }

  // ---------- weather ----------
  var WMO = { 0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Fog", 48: "Fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle", 56: "Freezing drizzle", 57: "Freezing drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain", 66: "Freezing rain", 67: "Freezing rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains", 80: "Rain showers", 81: "Rain showers", 82: "Heavy showers",
    85: "Snow showers", 86: "Snow showers", 95: "Thunderstorms", 96: "Thunderstorms, hail", 99: "Thunderstorms, hail" };

  function card(label, body) { return '<div class="alm-card"><div class="alm-label">' + label + "</div>" + body + "</div>"; }

  H.almanacHtml = function () {
    var iso = H.today(), p = iso.split("-"), noon = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 17)); // midday Eastern, used for the day's sun and moon
    var sun = sunTimes(noon), m = moon(noon), w = window.HUB_WEATHER, num = function (x) { return typeof x === "number" && isFinite(x); };
    var wBody;
    if (w && num(w.high) && num(w.low) && String(w.date) === iso) {
      wBody = '<div class="alm-big">' + Math.round(w.high) + '° <span>/ ' + Math.round(w.low) + '°</span></div><div class="alm-sub">High / low · ' + esc(WMO[w.code] || "Forecast") + (num(w.rain) ? " · " + Math.round(w.rain) + "% chance of rain" : "") + "</div>";
    } else if (w && num(w.high) && num(w.low) && /^\d{4}-\d{2}-\d{2}$/.test(String(w.date))) {
      wBody = '<div class="alm-big alm-stale">' + Math.round(w.high) + '° <span>/ ' + Math.round(w.low) + '°</span></div><div class="alm-sub">From ' + esc(H.fmtDate(w.date)) + " — today’s forecast arrives early morning</div>";
    } else wBody = '<div class="alm-sub">Today’s forecast arrives early each morning.</div>';
    var moonSub = m.illum + "% lit · " + (m.toFull <= m.toNew ? "full moon in " + m.toFull + (m.toFull === 1 ? " day" : " days") : "new moon in " + m.toNew + (m.toNew === 1 ? " day" : " days"));
    return '<div class="almanac">' +
      card("Sunrise & sunset · Columbia, MD", '<div class="alm-big">↑ ' + esc(clock(sun.rise)) + '</div><div class="alm-big alm-set">↓ ' + esc(clock(sun.set)) + '</div><div class="alm-sub">Sunrise / sunset</div>') +
      card("Weather · Columbia, MD", wBody) +
      card("Moon", '<div class="alm-moon">' + moonSvg(m.f) + '<div><div class="alm-name">' + esc(m.name) + '</div><div class="alm-sub">' + esc(moonSub) + "</div></div></div>") + "</div>";
  };
  H._almanacTest = { sunTimes: sunTimes, moon: moon, clock: clock };
})();
