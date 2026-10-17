// Core: storage, helpers, bank loader, router. Plain script (no modules) so it works from file://.
(function () {
  "use strict";
  var KEY = "davis-dev-hub-v1";
  var Hub = (window.Hub = { views: {}, data: window.HUB_DATA || {}, banks: [], warnings: [] });

  Hub.repo = "daviswhiting10/dev-hub";   // used to build prefilled GitHub Issue links (poll + feedback)
  Hub.$ = function (s, r) { return (r || document).querySelector(s); };
  Hub.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  Hub.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  Hub.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  Hub.pct = function (c, n) { return n ? Math.round((c / n) * 100) : 0; };
  Hub.safeUrl = function (u) { u = String(u || "").trim(); return /^https?:\/\//i.test(u) ? u : ""; };

  // ---------- dates ----------
  Hub.iso = function (d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };
  Hub.parse = function (s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
  Hub.today = function () {
    var m = /[?&]date=(\d{4}-\d{2}-\d{2})/.exec(location.hash + location.search); // ?date=YYYY-MM-DD to preview a day
    return m ? m[1] : Hub.iso(new Date());
  };
  Hub.fmtDate = function (s) {
    var d = typeof s === "number" ? new Date(s) : Hub.parse(s);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };
  Hub.daysBetween = function (a, b) { return Math.round((Hub.parse(b) - Hub.parse(a)) / 86400000); };

  // ---------- storage ----------
  var persistOK = true;
  function load() {
    try { var r = localStorage.getItem(KEY); return r ? JSON.parse(r) : {}; } catch (e) { persistOK = false; return {}; }
  }
  function defaults() {
    return {
      done: {}, days: {}, projects: null, seeded: [],
      reviewed: {},                                // Daily Five check-offs: { briefingDate: { itemId: timestamp } }
      briefing: { text: "", date: "" },
      tests: { attempts: [], q: {}, log: [], answered: 0, inProgress: null },
      feedback: { votes: {}, sent: {}, sentAt: 0 }, // briefing item votes: { itemId: "up" | "down" | "more" }; `sent` = what was already sent
      poll: { answers: {}, submittedAt: 0 },       // draft/submitted poll answers (see js/poll.js)
      profile: {
        name: "Davis Whiting", headline: "Fitness professional building AI systems with Claude",
        location: "", email: "", links: "",
        summary: "Fitness professional transitioning into AI engineering. Building agentic and retrieval-based systems with Claude, with a focus on health and fitness applications.",
        experience: ""
      }
    };
  }
  Hub.store = (function () {
    var d = defaults(), s = load();
    Object.keys(d).forEach(function (k) {
      if (s[k] == null) s[k] = d[k];
      else if (d[k] && typeof d[k] === "object" && !Array.isArray(d[k]) && s[k] && typeof s[k] === "object")
        Object.keys(d[k]).forEach(function (j) { if (s[k][j] == null) s[k][j] = d[k][j]; });
    });
    return s;
  })();
  Hub.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(Hub.store)); persistOK = true; } catch (e) { persistOK = false; }
    var b = Hub.$("#saveState");
    if (b) { b.textContent = persistOK ? "Saved locally" : "⚠ Not saving — export a backup"; b.className = "save-state" + (persistOK ? "" : " warn"); }
  };
  Hub.touch = function () { var t = Hub.today(); Hub.store.days[t] = (Hub.store.days[t] || 0) + 1; };
  Hub.streak = function () {
    var d = Hub.parse(Hub.today()), days = Hub.store.days, n = 0;
    if (!days[Hub.iso(d)]) d.setDate(d.getDate() - 1);
    while (days[Hub.iso(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  Hub.toggleDone = function (id) {
    if (Hub.store.done[id]) delete Hub.store.done[id];
    else { Hub.store.done[id] = Date.now(); Hub.touch(); }
    Hub.save();
  };

  // Backup: download / restore everything as one JSON file.
  Hub.exportData = function () {
    var blob = new Blob([JSON.stringify(Hub.store, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "dev-hub-backup-" + Hub.iso(new Date()) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
  };
  Hub.importData = function (file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var o = JSON.parse(r.result);
        if (!o || typeof o !== "object" || !o.tests) throw new Error("not a Dev Hub backup");
        localStorage.setItem(KEY, JSON.stringify(o));
        location.reload();
      } catch (e) { alert("Could not import: " + e.message); }
    };
    r.readAsText(file);
  };

  // ---------- roadmap helpers ----------
  Hub.sprintFor = function (iso) {
    var s = Hub.data.roadmap.sprints;
    if (iso < s[0].start) return { state: "before", sprint: s[0] };
    if (iso > s[s.length - 1].end) return { state: "after", sprint: s[s.length - 1] };
    for (var i = 0; i < s.length; i++) if (iso >= s[i].start && iso <= s[i].end) return { state: "active", sprint: s[i], index: i };
    return { state: "gap", sprint: s[0] };
  };
  Hub.phaseOf = function (id) { return Hub.data.roadmap.phases.filter(function (p) { return p.id === id; })[0]; };
  Hub.progressOf = function (sprints) {
    var n = 0, c = 0;
    sprints.forEach(function (sp) { sp.milestones.forEach(function (m) { n++; if (Hub.store.done[m.id]) c++; }); });
    return { done: c, total: n, pct: Hub.pct(c, n) };
  };

  // ---------- question bank loader ----------
  // Tries q1.js, q2.js, ... and stops after two consecutive misses, so dropping in q4.js "just works".
  // Extra bank scripts declared by a suite in data/tests.js (`files`), so a new suite needs no code change.
  function loadExtra() {
    var files = [];
    ((window.HUB_TESTS && window.HUB_TESTS.suites) || []).forEach(function (su) {
      (Array.isArray(su.files) ? su.files : []).forEach(function (f) { if (/^[\w.\-\/]+\.js$/.test(f) && f.indexOf("..") < 0 && files.indexOf(f) < 0) files.push(f); });
    });
    return Promise.all(files.map(function (f) {
      return new Promise(function (res) { var sc = document.createElement("script"); sc.src = f; sc.onload = sc.onerror = function () { res(); }; document.head.appendChild(sc); });
    }));
  }
  Hub.loadBanks = function () {
    return new Promise(function (resolve) {
      window.EXAMS = window.EXAMS || [];
      var n = 1, misses = 0;
      function next() {
        if (misses >= 2 || n > 60) return loadExtra().then(resolve);
        var s = document.createElement("script");
        s.src = "q" + n + ".js";
        s.onload = function () { misses = 0; n++; next(); };
        s.onerror = function () { misses++; n++; s.remove(); next(); };
        document.head.appendChild(s);
      }
      next();
    });
  };
  Hub.normalizeBanks = function () {
    var seen = {};
    (window.EXAMS || []).forEach(function (ex, bi) {
      var id = ex && ex.id != null ? ex.id : "bank" + (bi + 1);
      if (seen[id]) { Hub.warnings.push("Duplicate bank id " + id + " ignored."); return; }
      seen[id] = 1;
      var qs = [];
      (ex.questions || []).forEach(function (q, i) {
        var bad = !q || typeof q.q !== "string" || !Array.isArray(q.o) || q.o.length < 2 || !Array.isArray(q.a) || !q.a.length ||
          q.a.some(function (x) { return !(x >= 0 && x < q.o.length); });
        if (bad) { Hub.warnings.push((ex.title || id) + ": question #" + (i + 1) + " is malformed and was skipped."); return; }
        qs.push({ q: q.q, o: q.o, a: q.a, e: q.e || "", s: q.s || 0, d: q.d || 0, key: id + ":" + hash(q.q) });
      });
      Hub.banks.push({ id: id, title: ex.title || "Bank " + id, questions: qs });
    });
    Hub.banks.sort(function (a, b) { return a.id > b.id ? 1 : a.id < b.id ? -1 : 0; });
  };
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }

  // ---------- resume data (everything the app knows you've done) ----------
  Hub.collect = function () {
    var done = Hub.store.done, out = { certs: [], skills: {}, highlights: [], projects: [], log: [], pending: [] };
    function addSkills(arr) { (arr || []).forEach(function (s) { out.skills[s] = 1; }); }
    function consider(it, source) {
      var ts = done[it.id];
      if (ts) {
        addSkills(it.skill);
        if (it.cert) out.certs.push({ name: it.cert.name, issuer: it.cert.issuer, ts: ts });
        if (it.resume) out.highlights.push({ text: it.resume, ts: ts });
        out.log.push({ title: it.t, source: source, ts: ts });
      } else if (it.cert) out.pending.push("Certification in progress: " + it.cert.name);
    }
    Hub.data.roadmap.sprints.forEach(function (sp) { sp.milestones.forEach(function (m) { consider(m, sp.id + " · " + sp.name); }); });
    Hub.data.playbook.steps.forEach(function (st) { st.items.forEach(function (it) { consider(it, "Playbook · " + st.name); }); });
    ((Hub.data.learn && Hub.data.learn.steps) || []).forEach(function (st) { st.items.forEach(function (it) { consider(it, "Learn · " + st.name); }); });
    (Hub.store.projects || []).forEach(function (p) {
      if (p.status === "shipped") {
        addSkills(p.skills);
        out.projects.push(p);
        out.log.push({ title: "Shipped: " + p.title, source: "Projects", ts: p.shippedAt || 0 });
      } else out.pending.push("Project not shipped yet: " + p.title);
    });
    out.log.sort(function (a, b) { return b.ts - a.ts; });
    out.skillList = Object.keys(out.skills).sort();
    return out;
  };

  // ---------- projects: merge seeds into the store ----------
  Hub.initProjects = function () {
    var st = Hub.store;
    if (!Array.isArray(st.projects)) st.projects = [];
    (Hub.data.projects || []).forEach(function (seed) {
      if (st.seeded.indexOf(seed.id) < 0) { st.projects.push(JSON.parse(JSON.stringify(seed))); st.seeded.push(seed.id); }
    });
  };

  // ---------- router ----------
  var current = null;
  Hub.route = function () {
    var h = location.hash.replace(/^#\/?/, ""), parts = h.split("?");
    var name = parts[0] || "today", params = {};
    new URLSearchParams(parts[1] || "").forEach(function (v, k) { params[k] = v; });
    params._nav = 1;
    if (!Hub.views[name]) name = "today";
    if (current && Hub.views[current].leave) Hub.views[current].leave();
    current = name;
    Hub.$$("#nav a").forEach(function (a) { a.classList.toggle("on", a.dataset.view === name); });
    var el = Hub.$("#view");
    document.body.classList.remove("exam-skin");
    el.innerHTML = "";
    el.onclick = el.onchange = el.onsubmit = null;
    Hub.views[name].render(el, params);
    window.scrollTo(0, 0);
    Hub.save();
  };
  Hub.go = function (name, qs) { location.hash = "#/" + name + (qs ? "?" + qs : ""); };
  Hub.rerender = function () { var el = Hub.$("#view"); if (current) { Hub.views[current].render(el, {}); } };
  window.addEventListener("hashchange", function () { Hub.route(); });

  // ---------- small shared UI pieces ----------
  Hub.bar = function (pct, color) {
    return '<div class="track"><div class="fill" style="width:' + Math.max(0, Math.min(100, pct)) + "%" + (color ? ";background:" + color : "") + '"></div></div>';
  };
  Hub.trendSVG = function (vals, passPct) {
    if (!vals.length) return '<div class="empty small">No attempts yet — finish a practice test to start the trend.</div>';
    var W = 300, H = 90, px = 8, py = 8, n = vals.length;
    function X(i) { return n === 1 ? W / 2 : px + (i * (W - 2 * px)) / (n - 1); }
    function Y(v) { return H - py - (v / 100) * (H - 2 * py); }
    var pts = vals.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); }).join(" ");
    var dots = vals.map(function (v, i) { return '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="3.2" class="dot"><title>' + v + "%</title></circle>"; }).join("");
    return '<svg viewBox="0 0 ' + W + " " + H + '" class="trend" role="img" aria-label="Accuracy trend">' +
      '<line x1="0" x2="' + W + '" y1="' + Y(passPct).toFixed(1) + '" y2="' + Y(passPct).toFixed(1) + '" class="passline"/>' +
      '<text x="' + (W - 2) + '" y="' + (Y(passPct) - 3).toFixed(1) + '" class="passtxt" text-anchor="end">pass ≈ ' + passPct + "%</text>" +
      (n > 1 ? '<polyline points="' + pts + '" class="line"/>' : "") + dots + "</svg>";
  };
})();
