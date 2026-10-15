// Roadmap: interactive timeline of phases and 2-week sprints with checkable milestones.
(function () {
  "use strict";
  var H = Hub, esc = H.esc;
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
      el.innerHTML = '<div class="page"><h1>Roadmap</h1><p class="lead">' + esc(rm.goal) + " Check milestones as you finish them — certifications and tagged skills flow into your Digital Resume.</p>" +
        '<div class="card"><div class="prog-line"><span class="small">Overall</span>' + H.bar(op.pct, "var(--blue)") + '<span class="small">' + op.done + "/" + op.total + " milestones</span></div></div>" + phases +
        '<p class="muted small">Edit <code>data/roadmap.js</code> to change phases, sprints or milestones.</p></div>';
      el.onchange = function (ev) {
        var t = ev.target; if (t.dataset && t.dataset.ms) {
          var open = H.$$("details.sprint[open]", el).map(function (d) { return H.$(".sid", d).textContent; });
          H.toggleDone(t.dataset.ms); H.views.roadmap.render(el);
          H.$$("details.sprint", el).forEach(function (d) { d.open = open.indexOf(H.$(".sid", d).textContent) >= 0; });
        }
      };
    }
  };
})();
