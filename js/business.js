// Emerging Business Models: the daily scan on the Today tab (data/business/*), shown above the Jobs Radar. Display-only:
// Muse publishes the data. Text is UNTRUSTED: escaped, links must be http(s). Over http(s) the site reads YYYY-MM-DD.json +
// index.json; on file:// (no fetch) it reads the .js twins instead (see data/business/FORMAT.md).
(function () {
  "use strict";
  var H = Hub, esc = H.esc, DATE = /^\d{4}-\d{2}-\d{2}$/;
  function s(x, n) { return String(x == null ? "" : x).slice(0, n || 2000); }
  function loadScript(src) {
    return new Promise(function (res) {
      var t = document.createElement("script"); t.src = src; t.onload = function () { res(true); }; t.onerror = function () { t.remove(); res(false); };
      document.head.appendChild(t);
    });
  }
  function valid(j) { return j && DATE.test(String(j.date)) && Array.isArray(j.models); }

  var cached = null;
  H.loadBusiness = function () {
    if (cached) return cached;
    var v = "?v=" + Math.floor(Date.now() / 600000), http = /^https?:$/.test(location.protocol) && typeof fetch === "function";
    window.BUSINESS = window.BUSINESS || [];
    function fromJs() {
      return loadScript("data/business/index.js" + v).then(function () {
        var days = (window.BUSINESS_INDEX || []).map(function (e) { return e && (e.date || e); }).filter(function (d) { return DATE.test(String(d)); });
        if (!days.length) return null;
        return loadScript("data/business/" + days[0] + ".js" + v).then(function () { return window.BUSINESS.filter(function (j) { return j && j.date === days[0] && valid(j); })[0] || null; });
      });
    }
    function fromJson() {
      return fetch("data/business/index.json" + v).then(function (r) { return r.ok ? r.json() : []; }).then(function (idx) {
        var days = (Array.isArray(idx) ? idx : []).map(function (e) { return e && e.date; }).filter(function (d) { return DATE.test(String(d)); });
        if (!days.length) return null;
        return fetch("data/business/" + days[0] + ".json" + v).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { return valid(j) ? j : null; });
      });
    }
    cached = (http ? fromJson().then(function (j) { return j || fromJs(); }) : fromJs()).catch(function () { return null; });
    return cached;
  };

  function model(m) {
    if (!m || !m.name) return "";
    var u = H.safeUrl(m.url), src = m.source ? s(m.source, 60) : "";
    return '<article class="story bm"><h3>' + esc(s(m.name, 60)) + "</h3>" +
      (m.what_it_is ? "<p>" + esc(s(m.what_it_is, 280)) + "</p>" : "") +
      (m.why_emerging ? '<p class="pull">' + esc(s(m.why_emerging, 280)) + "</p>" : "") +
      (m.technique ? '<div class="bm-tech"><div class="eyebrow">The technique</div><p>' + esc(s(m.technique, 500)) + "</p></div>" : "") +
      '<div class="story-foot"><span class="small">' + (m.who ? "<b>Who:</b> " + esc(s(m.who, 120)) : "") + "</span>" +
      (u ? '<span class="src"><a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(src || u) + " ↗</a></span>" : src ? '<span class="src muted">' + esc(src) + "</span>" : "") + "</div></article>";
  }

  H.businessShell = function () { return '<section class="report bm-sec" id="bizModels"><div class="report-head"><h2>Emerging business models</h2></div><p class="muted small">Loading…</p></section>'; };
  H.mountBusiness = function (root) {
    var sec = H.$("#bizModels", root); if (!sec) return;
    H.loadBusiness().then(function (j) {
      if (!sec.isConnected) return;
      var head = '<div class="report-head"><h2>Emerging business models</h2>' + (j ? '<span class="small muted">' + esc(H.fmtDate ? H.fmtDate(j.date) : j.date) + "</span>" : "") + "</div>";
      if (!j) { sec.innerHTML = head + '<div class="empty-note"><p class="lead">The business-models scan lands each morning.</p></div>'; return; }
      sec.innerHTML = head + (j.headline ? '<p class="lead">' + esc(s(j.headline, 120)) + "</p>" : "") +
        j.models.slice(0, 6).map(model).join("") +
        (j.signal ? '<div class="jr-signal"><div class="eyebrow">The signal</div><p>' + esc(s(j.signal, 200)) + "</p></div>" : "");
    });
  };
})();
