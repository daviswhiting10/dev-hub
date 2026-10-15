// 2026 AI Engineer Playbook: checklist distilled from the reel. Checked items feed the Digital Resume.
(function () {
  "use strict";
  var H = Hub, esc = H.esc;
  H.views.playbook = {
    render: function (el) {
      var pb = H.data.playbook, done = H.store.done, total = 0, c = 0;
      pb.steps.forEach(function (s) { s.items.forEach(function (i) { total++; if (done[i.id]) c++; }); });
      var steps = pb.steps.map(function (s) {
        var n = s.items.length, d = s.items.filter(function (i) { return done[i.id]; }).length;
        var items = s.items.map(function (i) {
          var link = H.safeUrl(i.link);
          return '<label class="check"><input type="checkbox" data-pb="' + i.id + '"' + (done[i.id] ? " checked" : "") + "><span>" + esc(i.t) +
            (link ? ' <a class="ext" href="' + esc(link) + '" target="_blank" rel="noopener">open ↗</a>' : "") + "</span></label>";
        }).join("");
        return '<section class="card step"><div class="step-head"><span class="num">' + s.n + '</span><div class="grow"><h2 class="tight">' + esc(s.name) + '</h2><div class="muted small">' + esc(s.why) + '</div></div><span class="small ' + (d === n ? "okc" : "muted") + '">' + d + "/" + n + "</span></div>" + items + "</section>";
      }).join("");
      el.innerHTML = '<div class="page"><h1>2026 AI Engineer Playbook</h1><p class="lead">' + esc(pb.principle) + '</p><div class="card"><div class="prog-line"><span class="small">Playbook</span>' + H.bar(H.pct(c, total), "var(--accent)") + '<span class="small">' + c + "/" + total + "</span></div>" +
        '<div class="muted small">Source: ' + esc(pb.source) + '. Distilled from the reel’s on-screen text; edit <code>data/playbook.js</code> to refine.</div></div>' + steps + "</div>";
      el.onchange = function (ev) { var t = ev.target; if (t.dataset && t.dataset.pb) { H.toggleDone(t.dataset.pb); H.views.playbook.render(el); } };
    }
  };
})();
