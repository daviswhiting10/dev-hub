// Today: the Daily Five checklist (top 5 stories of the latest briefing) above the full tech news report.
// Briefing text comes from web research, so it is UNTRUSTED: everything is escaped and links must be http(s).
(function () {
  "use strict";
  var H = Hub, esc = H.esc;
  function s(x, n) { return String(x == null ? "" : x).slice(0, n || 2000); }
  function sid(id) { return String(id).replace(/[^\w-]/g, "_"); }

  // ---------- interest matching (briefing tags vs data/profile.js topics) ----------
  var STOP = { ai: 1, and: 1, the: 1, for: 1, new: 1 };
  function tokens(x) { return String(x || "").toLowerCase().split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 3 && !STOP[w]; }); }
  function beatName(id) {
    var b = ((window.HUB_STRATEGY || {}).beats || []).filter(function (x) { return x.id === id; })[0];
    return b ? b.name : id;
  }
  function matches(it) {
    var topics = ((window.HUB_PROFILE || {}).topics || []), out = [];
    topics.forEach(function (t) {
      var tt = tokens(t).concat(tokens(beatName(t)));
      var hit = (it.tags || []).some(function (g) { var gt = tokens(g); return String(g) === t || gt.some(function (w) { return tt.indexOf(w) >= 0; }); });
      if (hit && out.indexOf(beatName(t)) < 0) out.push(beatName(t));
    });
    return out;
  }

  // ---------- Daily Five state ----------
  function reviewed(date) { var r = H.store.reviewed; return (r[date] = r[date] || {}); }
  function prune() {
    var r = H.store.reviewed, ks = Object.keys(r).sort();
    while (ks.length > 30) delete r[ks.shift()];
  }
  function count(date, items) { var r = reviewed(date); return items.filter(function (it) { return r[it.id]; }).length; }
  function progressText(date, items) { return count(date, items) + " of " + items.length + " reviewed"; }

  function five(date, items) {
    var r = reviewed(date);
    return '<ol class="five">' + items.map(function (it, i) {
      var on = !!r[it.id];
      return '<li class="five-item' + (on ? " done" : "") + '" data-id="' + esc(sid(it.id)) + '" data-rid="' + esc(s(it.id, 60)) + '">' +
        '<button class="pencil" role="checkbox" aria-checked="' + on + '" aria-label="Mark reviewed"><span></span></button>' +
        '<a class="five-t" href="#story-' + esc(sid(it.id)) + '"><span class="five-n">' + (i + 1) + '.</span> <span class="five-txt">Review: ' + esc(s(it.title, 160)) + "</span></a></li>";
    }).join("") + "</ol>";
  }

  function link(src) {
    var u = H.safeUrl(src && src.url); if (!u) return "";
    return '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(s(src.title, 120) || u) + " ↗</a>";
  }
  function story(it) {
    var m = matches(it), v = H.store.feedback.votes[it.id], down = v === "down", more = v === "more";
    var srcs = (it.sources || []).map(link).filter(Boolean).join(" · ");
    return '<article class="story" id="story-' + esc(sid(it.id)) + '" data-id="' + esc(s(it.id, 60)) + '">' +
      "<h3>" + esc(s(it.title, 200)) + "</h3><p>" + esc(s(it.summary, 600)) + "</p>" +
      (it.why ? '<p class="pull">' + esc(s(it.why, 500)) + "</p>" : "") +
      '<div class="match">' + (m.length ? "Matches your interests: " + esc(m.join(" · ")) : "Outside your stated interests") + "</div>" +
      (it.analysis ? '<details class="deep"><summary>More detail</summary><p>' + esc(s(it.analysis, 2500)) + "</p></details>" : "") +
      '<div class="story-foot">' + (srcs ? '<span class="src">' + srcs + "</span>" : '<span class="src muted">No external source</span>') +
      '<span class="votes"><button class="less' + (more ? " on" : "") + '" data-vote="more">' + (more ? "Noted — more like this" : "More like this") + "</button>" +
      '<button class="less' + (down ? " on" : "") + '" data-vote="down">' + (down ? "Noted — less like this" : "Less like this") + "</button></span></div></article>";
  }

  H.views.today = {
    render: function (el, params) {
      var all = H.feedback ? H.feedback.list() : [];
      var cur = all.filter(function (b) { return b.date === (params && params.d); })[0] || all[0];
      var date = H.fmtDate(H.today());
      if (!cur) {
        el.innerHTML = '<div class="page paper"><div class="eyebrow">Today · ' + esc(date) + "</div>" + H.almanacHtml() + '<h1>The Daily Five</h1>' +
          '<div class="empty-note"><p class="lead">The morning briefing lands at 7 AM — check back then.</p></div>' + more() + "</div>";
        return;
      }
      var items = cur.items.slice(0, 5), sample = cur.meta && cur.meta.sample;
      el.innerHTML = '<div class="page paper"><div class="eyebrow">Today · ' + esc(date) + "</div>" + H.almanacHtml() + "<h1>" + esc(s(cur.headline, 120) || "Your morning briefing") + "</h1>" +
        (sample ? '<p class="sample-note small">Sample briefing — placeholder content until the first real morning run.</p>' : "") +
        '<section class="daily"><div class="daily-head"><h2>The Daily Five</h2><span class="progress" id="prog">' + esc(progressText(cur.date, items)) + "</span></div>" +
        five(cur.date, items) + "</section>" +
        '<section class="report"><div class="report-head"><h2>Tech news report</h2>' +
        (all.length > 1 ? '<label class="small muted">Archive <select id="bsel">' + all.map(function (b) { return '<option value="' + esc(b.date) + '"' + (b === cur ? " selected" : "") + ">" + esc(b.date) + "</option>"; }).join("") + "</select></label>" : "") + "</div>" +
        (cur.tldr ? '<p class="lead">' + esc(s(cur.tldr, 500)) + "</p>" : "") +
        (cur.for_you ? '<p class="pull">' + esc(s(cur.for_you, 400)) + "</p>" : "") +
        cur.items.map(story).join("") +
        '<div class="sendbar"><a class="btn small" id="fbSend" target="_blank" rel="noopener" href="' + esc(H.feedback.url()) + '">Send feedback</a> <span class="small muted" id="fbNote"></span></div></section>' + more() + "</div>";

      var root = H.$(".page", el), items5 = items;
      function note() {
        var n = H.feedback.pending().length, b = H.$("#fbSend", root), t = H.$("#fbNote", root); if (!b) return;
        b.href = H.feedback.url(); b.classList.toggle("primary", n > 0);
        t.textContent = n ? n + " note" + (n === 1 ? "" : "s") + " ready for your agents. Opens a prefilled GitHub Issue." : "Mark stories “More” or “Less like this” and send them here.";
      }
      note();
      root.addEventListener("change", function (ev) { if (ev.target.id === "bsel") H.go("today", "d=" + ev.target.value); });
      root.addEventListener("click", function (ev) {
        var t = ev.target, li = t.closest && t.closest(".five-item");
        if (t.closest && t.closest(".pencil") && li) { // check off: toggle classes in place so the strike-through animates
          var r = reviewed(cur.date), id = li.dataset.rid, on = !r[id];
          if (on) { r[id] = Date.now(); H.touch(); } else delete r[id];
          prune(); H.save();
          li.classList.toggle("done", on); t.closest(".pencil").setAttribute("aria-checked", on);
          H.$("#prog", root).textContent = progressText(cur.date, items5); return;
        }
        var a = t.closest && t.closest(".five-t");
        if (a) { // scroll to and highlight the full story
          ev.preventDefault();
          var el2 = document.getElementById("story-" + li.dataset.id); if (!el2) return;
          el2.scrollIntoView({ behavior: window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
          el2.classList.remove("flash"); void el2.offsetWidth; el2.classList.add("flash"); return;
        }
        var vb = t.closest && t.closest("[data-vote]");
        if (vb) { // one vote per story: pressing the other button switches it, pressing the same one clears it
          var sid2 = vb.closest(".story").dataset.id, f = H.store.feedback, want = vb.dataset.vote;
          if (f.votes[sid2] === want) delete f.votes[sid2]; else f.votes[sid2] = want;
          H.touch(); H.save();
          var cur2 = f.votes[sid2];
          H.$$("[data-vote]", vb.parentNode).forEach(function (bt) {
            var on = cur2 === bt.dataset.vote, w = bt.dataset.vote;
            bt.classList.toggle("on", on); bt.textContent = on ? "Noted — " + (w === "more" ? "more" : "less") + " like this" : (w === "more" ? "More" : "Less") + " like this";
          });
          note(); return;
        }
        if (t.id === "fbSend") { H.feedback.pending().forEach(function (x) { H.store.feedback.sent[x.item] = x.vote; }); H.store.feedback.sentAt = Date.now(); H.save(); setTimeout(note, 0); }
      });
    }
  };
  function more() { return ""; }
})();
