// Learn: a one-week AI curriculum (data/learn.js). Checked items feed the Digital Resume. Same pattern as the Playbook.
(function () {
  "use strict";
  var H = Hub, esc = H.esc;
  H.views.learn = {
    render: function (el) {
      var ln = H.data.learn, done = H.store.done, total = 0, c = 0;
      ln.steps.forEach(function (s) { s.items.forEach(function (i) { total++; if (done[i.id]) c++; }); });
      var steps = ln.steps.map(function (s) {
        var n = s.items.length, d = s.items.filter(function (i) { return done[i.id]; }).length;
        var items = s.items.map(function (i) {
          var link = H.safeUrl(i.link);
          return '<label class="check"><input type="checkbox" data-ln="' + i.id + '"' + (done[i.id] ? " checked" : "") + "><span>" + esc(i.t) +
            (link ? ' <a class="ext" href="' + esc(link) + '" target="_blank" rel="noopener">watch ↗</a>' : "") + "</span></label>";
        }).join("");
        return '<section class="card step"><div class="step-head"><span class="num">' + s.n + '</span><div class="grow"><h2 class="tight">' + esc(s.name) + '</h2><div class="muted small">' + esc(s.why) + '</div></div><span class="small ' + (d === n ? "okc" : "muted") + '">' + d + "/" + n + "</span></div>" + items + "</section>";
      }).join("");
      el.innerHTML = '<div class="page"><h1>Learn</h1><p class="lead">' + esc(ln.principle) + '</p><div class="card"><div class="prog-line"><span class="small">This week</span>' + H.bar(H.pct(c, total), "var(--accent)") + '<span class="small">' + c + "/" + total + "</span></div>" +
        '<div class="muted small">Source: ' + esc(ln.source) + '. Provisional: built from the chapter titles, so refine the tasks in <code>data/learn.js</code> after watching.</div></div>' + steps + "</div>";
      el.onchange = function (ev) { var t = ev.target; if (t.dataset && t.dataset.ln) { H.toggleDone(t.dataset.ln); H.views.learn.render(el); } };
    }
  };
})();
