// Dashboard: today's focus, current sprint + phase, stats, weak domains.
(function () {
  "use strict";
  var H = Hub, esc = H.esc;

  H.views.dashboard = {
    render: function (el) {
      var st = H.store, rm = H.data.roadmap, today = H.today();
      var cur = H.sprintFor(today), sp = cur.sprint, phase = H.phaseOf(sp.phase);
      var phaseSprints = rm.sprints.filter(function (s) { return s.phase === sp.phase; });
      var pp = H.progressOf(phaseSprints), op = H.progressOf(rm.sprints), spp = H.progressOf([sp]);
      var att = st.tests.attempts, ans = st.tests.answered;
      var domTotals = H.domainStats(), c = 0, n = 0;
      Object.keys(domTotals).forEach(function (d) { c += domTotals[d].c; n += domTotals[d].n; });
      var shipped = (st.projects || []).filter(function (p) { return p.status === "shipped"; }).length;
      var weak = H.weakestDomains().slice(0, 2);
      var daysLeft = H.daysBetween(today, "2027-03-31");

      var when = cur.state === "before" ? "Starts " + H.fmtDate(sp.start) : cur.state === "after" ? "Roadmap complete" :
        "Day " + (H.daysBetween(sp.start, today) + 1) + " of " + (H.daysBetween(sp.start, sp.end) + 1) + " · ends " + H.fmtDate(sp.end);
      var ms = sp.milestones.map(function (m) {
        return '<label class="check"><input type="checkbox" data-ms="' + m.id + '"' + (st.done[m.id] ? " checked" : "") + "><span>" + esc(m.t) + "</span></label>";
      }).join("");
      var b = st.briefing, stale = b.date && b.date !== today;
      var trend = att.slice(-10).map(function (a) { return a.pct; });

      el.innerHTML = '<div class="page"><div class="hello"><div><h1>Dev Hub</h1><div class="muted">' + (daysLeft > 0 ? daysLeft + " days to March 31, 2027 — " : "") + esc(rm.goal) + "</div></div></div>" +
        '<div class="grid stats">' +
        stat("Questions answered", ans, ans ? "across " + att.length + " test" + (att.length === 1 ? "" : "s") : "start a test") +
        stat("Accuracy", n ? H.pct(c, n) + "%" : "—", n ? "all-time" : "no data yet") +
        stat("Projects shipped", shipped + " / " + (st.projects || []).length, shipped ? "keep shipping" : "ship the first one") +
        stat("Day streak", H.streak(), H.streak() ? "don’t break it" : "do one thing today") + "</div>" +

        '<div class="grid two"><div class="card"><div class="eyebrow">Today’s focus</div>' +
        (b.text ? '<div class="brief">' + esc(b.text).replace(/\n/g, "<br>") + "</div><div class=\"muted small\">" + (stale ? "From " + H.fmtDate(b.date) + " — paste today’s below" : "Pasted " + H.fmtDate(b.date)) + "</div>" : '<div class="muted">Paste your daily briefing from your AI assistant.</div>') +
        '<textarea id="brief" rows="3" placeholder="Paste today’s briefing…"></textarea><div class="row"><button class="btn primary small" id="saveBrief">Save</button>' + (b.text ? '<button class="btn ghost small" id="clearBrief">Clear</button>' : "") + "</div></div>" +

        '<div class="card"><div class="eyebrow">Current sprint</div><h2 class="tight">' + (cur.state === "active" ? sp.id + " · " : "") + esc(sp.name) + '</h2><div class="muted small">' + when + " · " + esc(phase.name) + " phase</div><p class=\"small\">" + esc(sp.focus) + "</p>" +
        '<div class="ms">' + ms + '</div><div class="prog-line"><span class="small muted">Sprint</span>' + H.bar(spp.pct, "var(--accent)") + '<span class="small">' + spp.done + "/" + spp.total + "</span></div></div></div>" +

        '<div class="grid two"><div class="card"><div class="eyebrow">Phase &amp; overall</div><div class="prog-line"><span class="small">' + esc(phase.id + " · " + phase.name) + "</span>" + H.bar(pp.pct, "var(--accent)") + '<span class="small">' + pp.pct + '%</span></div>' +
        '<div class="prog-line"><span class="small">Whole roadmap</span>' + H.bar(op.pct, "var(--blue)") + '<span class="small">' + op.pct + '%</span></div><div class="muted small">' + esc(phase.goal) + '</div><div class="row" style="margin-top:12px"><a class="btn small" href="#/roadmap">Open roadmap</a></div></div>' +

        '<div class="card"><div class="eyebrow">Accuracy trend</div>' + H.trendSVG(trend, H.PASS_PCT || 69) +
        (weak.length ? '<div class="weak"><span class="small muted">Weakest now:</span> ' + weak.map(function (d) {
          var s = domTotals[d]; return '<a class="chip bad" href="#/tests?drill=' + d + '">D' + d + " " + esc(H.DOMAINS[d]) + " · " + H.pct(s.rc, s.rn) + "% → drill</a>";
        }).join(" ") + "</div>" : '<div class="muted small" style="margin-top:8px">Answer at least 5 questions in a domain to see it ranked here.</div>') +
        '<div class="row" style="margin-top:12px"><a class="btn small primary" href="#/tests">Practice tests</a></div></div></div></div>';

      el.onclick = function (ev) {
        var t = ev.target;
        if (t.id === "saveBrief") { var v = H.$("#brief").value.trim(); if (v) { st.briefing = { text: v, date: today }; H.save(); H.views.dashboard.render(el); } }
        if (t.id === "clearBrief") { st.briefing = { text: "", date: "" }; H.save(); H.views.dashboard.render(el); }
      };
      el.onchange = function (ev) {
        var t = ev.target; if (t.dataset && t.dataset.ms) { H.toggleDone(t.dataset.ms); H.views.dashboard.render(el); }
      };
    }
  };
  function stat(label, val, sub) { return '<div class="card stat"><div class="sv">' + esc(val) + '</div><div class="sl">' + esc(label) + '</div><div class="muted small">' + esc(sub) + "</div></div>"; }
})();
