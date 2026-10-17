// Roadmap: interactive timeline of phases and 2-week sprints with checkable milestones.
(function () {
  "use strict";
  var H = Hub, esc = H.esc;
  // ---------- journey map ----------
  function status(ph, cur, today) {
    var sps = H.data.roadmap.sprints.filter(function (x) { return x.phase === ph.id; }), pr = H.progressOf(sps);
    var over = sps.length && today > sps[sps.length - 1].end;
    if (pr.total && pr.done === pr.total) return { k: "done", t: "Complete", pr: pr };
    if (cur.state === "active" && cur.sprint.phase === ph.id) return { k: "now", t: "In progress", pr: pr };
    if (over) return { k: "behind", t: "Behind", pr: pr };
    return { k: "next", t: "Up next", pr: pr };
  }
  function journey() {
    var rm = H.data.roadmap, j = rm.journey; if (!j || !j.checkpoints || !j.checkpoints.length) return "";
    var today = H.today(), cur = H.sprintFor(today), n = j.checkpoints.length, W = 1000, Ht = 250, x0 = 90, x1 = 910;
    var curPhase = (j.current && j.current.phase) || (cur.state === "after" ? null : cur.sprint.phase);
    var pts = j.checkpoints.map(function (c, i) { var x = x0 + (x1 - x0) * i / n; return { x: x, y: 130 + (i % 2 ? -34 : 34), c: c }; });
    pts.push({ x: x1, y: 130, goal: true });
    var d = "M" + 24 + " 130"; pts.forEach(function (p, i) { var q = i ? pts[i - 1] : { x: 24, y: 130 }, mx = (q.x + p.x) / 2; d += " C" + mx + " " + q.y + "," + mx + " " + p.y + "," + p.x + " " + p.y; });
    var out = "", here = null, doneAll = true;
    pts.forEach(function (p) {
      if (p.goal) return;
      var ph = H.phaseOf(p.c.phase); if (!ph) return;
      var st = status(ph, cur, today); if (st.k !== "done") doneAll = false;
      if (p.c.phase === curPhase) here = p;
      out += '<g class="cp ' + st.k + '"><circle cx="' + p.x + '" cy="' + p.y + '" r="11"/>' +
        (st.k === "done" ? '<path d="M' + (p.x - 5) + " " + p.y + "l4 4 7 -8\" class=\"tick\"/>" : "") +
        '<text x="' + p.x + '" y="' + (p.y + 32) + '" text-anchor="middle">' + esc(p.c.label) + "</text></g>";
    });
    var g = pts[pts.length - 1];
    if (!here && doneAll) here = g; else if (!here) here = pts[0];
    var gl = (j.endGoal && j.endGoal.label) || "Goal";
    out += '<g class="goal"><path d="M' + g.x + " " + (g.y - 34) + 'v40" class="pole"/><path d="M' + g.x + " " + (g.y - 34) + 'l30 9 -30 9z" class="flag"/><circle cx="' + g.x + '" cy="' + g.y + '" r="9"/>' +
      '<text x="' + g.x + '" y="' + (g.y + 44) + '" text-anchor="middle">' + esc(gl) + "</text></g>";
    var ini = esc(j.initials || "ME");
    out += '<g class="you" transform="translate(' + here.x + " " + (here.y - 58) + ')"><circle r="24" class="ring"/><g id="avatarDefault"><circle r="21" class="avbg"/><text text-anchor="middle" y="5">' + ini + "</text></g>" +
      '<clipPath id="avclip"><circle r="21"/></clipPath><image id="avatarImg" x="-21" y="-21" width="42" height="42" clip-path="url(#avclip)" preserveAspectRatio="xMidYMid slice" visibility="hidden"/>' +
      '<path d="M-6 24l6 9 6 -9z" class="pin"/><text y="-32" text-anchor="middle" class="here">You are here</text></g>';
    return '<div class="journey"><svg viewBox="0 -30 ' + W + " " + Ht + '" role="img" aria-label="Roadmap journey to ' + esc(gl) + '"><path d="' + d + '" class="road"/>' + out + "</svg></div>";
  }
  function phaseLines() {
    var rm = H.data.roadmap, today = H.today(), cur = H.sprintFor(today);
    return '<ul class="plines">' + rm.phases.map(function (ph) {
      var st = status(ph, cur, today);
      return '<li class="' + st.k + '"><b>' + esc(ph.name) + '</b> <span class="muted">' + esc(ph.range) + '</span><span class="pst">' + st.t + (st.pr.total ? " · " + st.pr.done + "/" + st.pr.total : "") + "</span></li>";
    }).join("") + "</ul>";
  }
  // Use the avatar image if it exists (assets/yo, with common extensions), else keep the styled default marker.
  function loadAvatar(el) {
    var j = (H.data.roadmap || {}).journey || {}, base = j.avatar, img = H.$("#avatarImg", el); if (!base || !img || !/^[\w.\-\/]+$/.test(base)) return;
    var cands = [base, base + ".png", base + ".jpg", base + ".jpeg", base + ".webp"];
    (function next(i) {
      if (i >= cands.length) return;
      var t = new Image(); t.onload = function () { img.setAttribute("href", cands[i]); img.setAttribute("visibility", "visible"); var d = H.$("#avatarDefault", el); if (d) d.setAttribute("visibility", "hidden"); };
      t.onerror = function () { next(i + 1); }; t.src = cands[i];
    })(0);
  }

  H.views.roadmap = {
    render: function (el) {
      var rm = H.data.roadmap, st = H.store, today = H.today(), cur = H.sprintFor(today);
      var op = H.progressOf(rm.sprints);
      var phases = rm.phases.map(function (p) {
        var sps = rm.sprints.filter(function (s) { return s.phase === p.id; }), pr = H.progressOf(sps);
        var isCur = cur.sprint.phase === p.id && cur.state === "active";
        var sprints = sps.map(function (s) {
          var sp = H.progressOf([s]), active = cur.state === "active" && cur.sprint.id === s.id;
          var past = today > s.end;
          var ms = s.milestones.map(function (m) {
            return '<label class="check"><input type="checkbox" data-ms="' + m.id + '"' + (st.done[m.id] ? " checked" : "") + "><span>" + esc(m.t) +
              (m.cert ? ' <span class="chip">certification</span>' : "") + "</span></label>";
          }).join("");
          return '<details class="sprint' + (active ? " current" : "") + (past && sp.done < sp.total ? " overdue" : "") + '"' + (active ? " open" : "") + "><summary><span class=\"sid\">" + s.id + "</span><span class=\"grow\"><b>" + esc(s.name) + '</b> <span class="muted small">' +
            H.fmtDate(s.start) + " – " + H.fmtDate(s.end) + "</span></span>" + (active ? '<span class="chip ok">now</span>' : past && sp.done < sp.total ? '<span class="chip bad">behind</span>' : "") +
            '<span class="small muted">' + sp.done + "/" + sp.total + "</span></summary><div class=\"sbody\"><p class=\"small muted\">" + esc(s.focus) + "</p>" + ms + "</div></details>";
        }).join("");
        return '<section class="phase' + (isCur ? " current" : "") + '"><div class="phase-head"><div><div class="eyebrow">' + p.id + " · " + esc(p.range) + "</div><h2 class=\"tight\">" + esc(p.name) + '</h2><div class="muted small">' + esc(p.goal) + '</div></div><div class="phase-prog">' + H.bar(pr.pct, "var(--accent)") + '<span class="small">' + pr.done + "/" + pr.total + " · " + pr.pct + "%</span></div></div>" + sprints + "</section>";
      }).join("");
      el.innerHTML = '<div class="page paper"><div class="eyebrow">Roadmap</div><h1>' + esc(rm.goal) + "</h1>" + journey() + phaseLines() +
        '<details class="card milestones"><summary><b>Sprints &amp; milestones</b> <span class="muted small">' + op.done + "/" + op.total + ' checked — certifications and tagged skills flow into your Digital Resume</span></summary>' + phases +
        '<p class="muted small">Edit <code>data/roadmap.js</code> to change phases, sprints, milestones or the journey map.</p></details></div>';
      loadAvatar(el);
      el.onchange = function (ev) {
        var t = ev.target; if (t.dataset && t.dataset.ms) {
          var open = H.$$("details.sprint[open]", el).map(function (d) { return H.$(".sid", d).textContent; });
          var wasOpen = H.$("details.milestones", el).open;
          H.toggleDone(t.dataset.ms); H.views.roadmap.render(el); H.$("details.milestones", el).open = wasOpen;
          H.$$("details.sprint", el).forEach(function (d) { d.open = open.indexOf(H.$(".sid", d).textContent) >= 0; });
        }
      };
    }
  };
})();
