// Jobs Radar: the weekly startup-job-market scan on the Today tab (data/jobs/*). Display-only: Muse's cron publishes the data.
// Data comes from web research, so it is UNTRUSTED: everything is escaped and links must be http(s).
// Over http(s) the site reads YYYY-WNN.json + index.json; on file:// (no fetch) it reads the .js twins instead (see data/jobs/FORMAT.md).
(function () {
  "use strict";
  var H = Hub, esc = H.esc, WEEK = /^\d{4}-W\d{2}$/;
  function s(x, n) { return String(x == null ? "" : x).slice(0, n || 2000); }
  function loadScript(src) {
    return new Promise(function (res) {
      var t = document.createElement("script"); t.src = src; t.onload = function () { res(true); }; t.onerror = function () { t.remove(); res(false); };
      document.head.appendChild(t);
    });
  }
  function valid(j) { return j && WEEK.test(String(j.week)) && Array.isArray(j.companies); }

  // Resolves to the newest valid week's data, or null when nothing is published (or loading failed).
  var cached = null;
  H.loadJobs = function () {
    if (cached) return cached;
    var v = "?v=" + Math.floor(Date.now() / 600000), http = /^https?:$/.test(location.protocol) && typeof fetch === "function";
    window.JOBS_RADAR = window.JOBS_RADAR || [];
    function fromJs() {
      return loadScript("data/jobs/index.js" + v).then(function () {
        var weeks = (window.JOBS_INDEX || []).map(function (e) { return e && (e.week || e); }).filter(function (w) { return WEEK.test(String(w)); });
        if (!weeks.length) return null;
        return loadScript("data/jobs/" + weeks[0] + ".js" + v).then(function () { return window.JOBS_RADAR.filter(function (j) { return j && j.week === weeks[0] && valid(j); })[0] || null; });
      });
    }
    function fromJson() {
      return fetch("data/jobs/index.json" + v).then(function (r) { return r.ok ? r.json() : []; }).then(function (idx) {
        var weeks = (Array.isArray(idx) ? idx : []).map(function (e) { return e && e.week; }).filter(function (w) { return WEEK.test(String(w)); });
        if (!weeks.length) return null;
        return fetch("data/jobs/" + weeks[0] + ".json" + v).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { return valid(j) ? j : null; });
      });
    }
    cached = (http ? fromJson().then(function (j) { return j || fromJs(); }) : fromJs()).catch(function () { return null; });
    return cached;
  };

  // ---------- fit with what you're learning (roadmap skills; matched on explicit `skills` the publisher listed, never guessed) ----------
  var GENERIC = { ai: 1, and: 1, the: 1, for: 1, new: 1, with: 1, use: 1, tool: 1, tools: 1, design: 1, applied: 1, domain: 1, expertise: 1, model: 1, models: 1 };
  function toks(x) { return String(x || "").toLowerCase().split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 3 && !GENERIC[w]; }); }
  function learning() {
    var out = [], rm = (window.HUB_DATA || {}).roadmap || {};
    (rm.sprints || []).forEach(function (sp) { (sp.milestones || []).forEach(function (m) { (m.skill || []).forEach(function (k) { if (out.indexOf(k) < 0) out.push(k); }); }); });
    return out;
  }
  function overlap(skill, mine) { // which of my skills does a posting's skill touch?
    var t = toks(skill);
    return mine.filter(function (m) { var mt = toks(m); return t.some(function (w) { return mt.indexOf(w) >= 0; }); });
  }
  function skillsOf(list) { return (Array.isArray(list) ? list : []).map(function (k) { return s(k, 40).trim(); }).filter(Boolean).slice(0, 12); }
  function coSkills(c) {
    var all = skillsOf(c.skills);
    (Array.isArray(c.notable_roles) ? c.notable_roles : []).forEach(function (r) { skillsOf(r && r.skills).forEach(function (k) { if (all.indexOf(k) < 0) all.push(k); }); });
    return all;
  }
  function fitHtml(c, mine) {
    var hit = [];
    coSkills(c).forEach(function (k) { overlap(k, mine).forEach(function (m) { if (hit.indexOf(m) < 0) hit.push(m); }); });
    return hit.length ? '<div class="match">Overlaps with what you are learning: ' + esc(hit.join(" · ")) + "</div>" : "";
  }
  // Skills ranked by how many companies ask for them, marked by whether your roadmap already covers them.
  function demandHtml(cos, mine) {
    var n = {}, order = [];
    cos.forEach(function (c) { var seen = {}; coSkills(c).forEach(function (k) { var key = k.toLowerCase(); if (seen[key]) return; seen[key] = 1; if (!n[key]) { n[key] = { label: k, c: 0 }; order.push(key); } n[key].c++; }); });
    if (!order.length) return "";
    var rows = order.map(function (k) { return n[k]; }).sort(function (a, b) { return b.c - a.c; }).slice(0, 8).map(function (r) {
      var m = overlap(r.label, mine);
      return '<li class="jr-skill"><span class="jr-sk">' + esc(r.label) + '</span><span class="small muted">' + r.c + " compan" + (r.c === 1 ? "y" : "ies") + "</span>" +
        '<span class="small ' + (m.length ? "jr-have" : "jr-gap") + '">' + (m.length ? "On your roadmap: " + esc(m.join(", ")) : "Not on your roadmap yet") + "</span></li>";
    }).join("");
    return '<div class="jr-demand"><div class="eyebrow">Where your effort lands</div><p class="small muted">Skills these postings list, ranked by how many of this week\'s companies ask for them.</p><ul class="jr-skills">' + rows + "</ul></div>";
  }

  function link(u, label) {
    u = H.safeUrl(u); return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + " ↗</a>" : esc(label);
  }
  function role(r) {
    if (!r || !r.title) return "";
    var parts = [link(r.url, s(r.title, 120))];
    if (r.comp) parts.push(esc(s(r.comp, 80)));
    if (r.location) parts.push(esc(s(r.location, 60)));
    return '<li class="jr-role">' + parts.join(' <span class="muted">—</span> ') + "</li>";
  }
  function company(c, mine) {
    if (!c || !c.name) return "";
    var roles = (Array.isArray(c.notable_roles) ? c.notable_roles : []).slice(0, 8).map(role).join("");
    return '<article class="story jr-co"><h3>' + esc(s(c.name, 100)) + "</h3>" +
      (c.what_they_build ? "<p>" + esc(s(c.what_they_build, 500)) + "</p>" : "") +
      (c.traction ? '<p class="small"><b>Traction:</b> ' + esc(s(c.traction, 300)) + "</p>" : "") +
      (c.why_it_matters ? '<p class="pull">' + esc(s(c.why_it_matters, 500)) + "</p>" : "") + fitHtml(c, mine) +
      (roles ? '<ul class="jr-roles">' + roles + "</ul>" : "") + "</article>";
  }
  function weekLabel(w) { var m = /^(\d{4})-W(\d{2})$/.exec(w); return m ? "Week " + +m[2] + ", " + m[1] : w; }

  // Section shell; mount() fills it once the data has loaded.
  H.jobsShell = function () { return '<section class="report jr" id="jobsRadar"><div class="report-head"><h2>Jobs Radar</h2></div><p class="muted small">Loading…</p></section>'; };
  H.mountJobs = function (root) {
    var sec = H.$("#jobsRadar", root); if (!sec) return;
    H.loadJobs().then(function (j) {
      if (!sec.isConnected) return; // user navigated away
      var head = '<div class="report-head"><h2>Jobs Radar</h2>' + (j ? '<span class="small muted">' + esc(weekLabel(j.week)) + "</span>" : "") + "</div>";
      if (!j) { sec.innerHTML = head + '<div class="empty-note"><p class="lead">The jobs radar lands Monday mornings.</p></div>'; return; }
      var cos = j.companies.slice(0, 12), mine = learning();
      sec.innerHTML = head + (j.headline ? '<p class="lead">' + esc(s(j.headline, 200)) + "</p>" : "") +
        cos.map(function (c) { return company(c, mine); }).join("") + demandHtml(cos, mine) +
        (j.signal ? '<div class="jr-signal"><div class="eyebrow">The signal</div><p>' + esc(s(j.signal, 400)) + "</p></div>" : "");
    });
  };
})();
