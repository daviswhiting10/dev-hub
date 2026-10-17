// Briefing: the daily AI briefing written by the research agents (data/briefings/*.js), with votes, the poll, and the
// agents' strategy changelog. All briefing text originates from web research, so it is treated as UNTRUSTED:
// everything is escaped and links must be http(s).
(function () {
  "use strict";
  var H = Hub, esc = H.esc, DATE = /^\d{4}-\d{2}-\d{2}$/;

  // ---------- loading (script tags only, so it works from file://) ----------
  function loadScript(src) {
    return new Promise(function (res) {
      var s = document.createElement("script"); s.src = src; s.onload = function () { res(true); }; s.onerror = function () { s.remove(); res(false); };
      document.head.appendChild(s);
    });
  }
  // Accepts the JSON schema documented in data/briefings/FORMAT.md ({stories, tldr, for_davis, ...}) and maps it to the
  // internal shape. Text is escaped at render time and links must be http(s), so nothing here needs to be trusted.
  H.normalizeJsonBriefing = function (j) {
    if (!j || !DATE.test(String(j.date)) || !Array.isArray(j.stories)) return null;
    return { date: j.date, headline: s(j.headline, 120), tldr: s(j.tldr, 500), for_you: s(j.for_davis || j.for_you, 400), meta: { format: "json" },
      items: j.stories.slice(0, 12).map(function (st, i) {
        return { id: j.date + "-" + (i + 1), title: s(st && st.title, 200), summary: s(st && st.summary, 600), why: s(st && st.why_it_matters, 400), analysis: "",
          tags: Array.isArray(st && st.topics) ? st.topics.slice(0, 5).map(function (t) { return s(t, 30); }) : [], confidence: "medium",
          sources: st && st.url ? [{ title: s(st.source, 120) || s(st.url, 120), url: st.url }] : [] };
      }).filter(function (it) { return it.title; }) };
  };
  function loadJsonBriefings(v) {
    if (!/^https?:$/.test(location.protocol) || typeof fetch !== "function") return Promise.resolve(); // file:// can't fetch JSON
    return fetch("data/briefings/index.json" + v).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; }).then(function (idx) {
      var dates = (Array.isArray(idx) ? idx : []).map(function (e) { return e && e.date; }).filter(function (d) { return typeof d === "string" && DATE.test(d); }).slice(0, 14);
      var have = (window.BRIEFINGS || []).map(function (b) { return b && b.date; });
      return Promise.all(dates.filter(function (d) { return have.indexOf(d) < 0; }).map(function (d) {
        return fetch("data/briefings/" + d + ".json" + v).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { var b = H.normalizeJsonBriefing(j); if (b) window.BRIEFINGS.push(b); }).catch(function () {});
      }));
    });
  }
  H.loadBriefings = function () {
    var v = "?v=" + Math.floor(Date.now() / 600000); // refresh at most every 10 minutes
    window.BRIEFINGS = window.BRIEFINGS || [];
    return loadScript("data/briefings/index.js" + v).then(function () {
      var idx = (window.BRIEFING_INDEX || []).filter(function (d) { return typeof d === "string" && DATE.test(d); }).slice(0, 14);
      var have = window.BRIEFINGS.map(function (b) { return b && b.date; });
      return Promise.all(idx.filter(function (d) { return have.indexOf(d) < 0; }).map(function (d) { return loadScript("data/briefings/" + d + ".js" + v); }));
    }).then(function () { return loadJsonBriefings(v); });
  };

  function list() {
    return (window.BRIEFINGS || []).filter(function (b) { return b && DATE.test(String(b.date)) && Array.isArray(b.items); })
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }
  H.latestBriefing = function () { return list()[0] || null; };
  function s(x, n) { return String(x == null ? "" : x).slice(0, n || 2000); }
  function link(src) {
    var u = H.safeUrl(src && src.url); if (!u) return "";
    return '<li><a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(s(src.title, 200) || u) + "</a></li>";
  }

  // ---------- feedback ----------
  function pending(b) {
    var f = H.store.feedback, out = [];
    list().forEach(function (br) {
      br.items.forEach(function (it) {
        var v = f.votes[it.id]; if (v && f.sent[it.id] !== v) out.push({ date: br.date, item: s(it.id, 40), vote: v, title: s(it.title, 140), tags: (it.tags || []).slice(0, 5).map(function (t) { return s(t, 30); }) });
      });
    });
    return out.slice(0, 40);
  }
  function feedbackUrl() {
    var p = { v: 1, kind: "feedback", at: new Date().toISOString(), votes: pending() };
    return "https://github.com/" + H.repo + "/issues/new?template=feedback.yml&title=" + encodeURIComponent("[hub-feedback] " + p.votes.length + " votes " + H.today()) +
      "&payload=" + encodeURIComponent(JSON.stringify(p));
  }

  H.feedback = { pending: pending, url: feedbackUrl, list: list };

  function itemHtml(it, i) {
    var v = H.store.feedback.votes[it.id], conf = s(it.confidence, 10);
    var srcs = (it.sources || []).map(link).join("");
    return '<article class="brief-item" data-id="' + esc(s(it.id, 40)) + '"><div class="brief-rank">' + (i + 1) + '</div><div class="grow">' +
      '<div class="tags">' + (it.tags || []).slice(0, 5).map(function (t) { return '<span class="tag">' + esc(s(t, 30)) + "</span>"; }).join("") +
      (conf ? '<span class="chip ' + (conf === "high" ? "ok" : conf === "low" ? "bad" : "") + '">' + esc(conf) + " confidence</span>" : "") + "</div>" +
      "<h3>" + esc(s(it.title, 200)) + "</h3><p>" + esc(s(it.summary, 600)) + "</p>" +
      '<details class="deep"><summary>Deep dive &amp; why it matters</summary>' +
      (it.why ? '<p><b>Why it matters to you:</b> ' + esc(s(it.why, 800)) + "</p>" : "") + (it.analysis ? "<p>" + esc(s(it.analysis, 2500)) + "</p>" : "") +
      (srcs ? '<div class="eyebrow">Sources</div><ul class="sources">' + srcs + "</ul>" : '<div class="muted small">No external sources.</div>') + "</details>" +
      '<div class="vote-row">' + [["up", "👍 Useful"], ["down", "👎 Skip"], ["more", "➕ More like this"]].map(function (x) {
        return '<button class="vbtn' + (v === x[0] ? " on" : "") + '" data-vote="' + x[0] + '">' + x[1] + "</button>";
      }).join("") + "</div></div></article>";
  }

  function changelogHtml() {
    var st = window.HUB_STRATEGY; if (!st || !Array.isArray(st.changelog)) return "";
    var rows = st.changelog.slice(-6).reverse().map(function (c) {
      var ch = (c.changes || []).map(function (x) { return "<li><code>" + esc(s(x.op, 30)) + "</code> " + esc(s(x.value, 120)) + (x.beat ? " <span class=\"muted\">(" + esc(s(x.beat, 40)) + ")</span>" : "") + (x.reason ? ' <span class="muted">— ' + esc(s(x.reason, 200)) + "</span>" : "") + "</li>"; }).join("");
      return '<div class="cl"><div class="small muted">' + esc(s(c.date, 12)) + " · strategy v" + esc(s(c.version, 6)) + "</div><div>" + esc(s(c.summary, 300)) + "</div>" + (ch ? '<ul class="small">' + ch + "</ul>" : "") + "</div>";
    }).join("");
    return '<div class="card"><div class="eyebrow">How the agents have changed</div>' + rows + '<p class="small muted">Every change is committed to <code>data/strategy.js</code>, so it is visible in git and easy to revert.</p></div>';
  }

  H.views.briefing = {
    render: function (el, params) {
      var all = list();
      if (!all.length) { el.innerHTML = '<div class="page"><h1>Briefing</h1><div class="card empty">No briefings yet. The first one is written by the daily agent run.</div></div>'; return; }
      var cur = all.filter(function (b) { return b.date === (params && params.d); })[0] || all[0];
      var sample = cur.meta && cur.meta.sample;
      el.innerHTML = '<div class="page"><div class="row between"><div><div class="eyebrow">Daily briefing</div><h1>' + esc(s(cur.headline, 120) || "Your AI briefing") + '</h1><div class="muted">' + esc(H.fmtDate(cur.date)) + " · " + cur.items.length + " items</div></div>" +
        '<label class="small muted">Archive <select id="bsel">' + all.map(function (b) { return '<option value="' + esc(b.date) + '"' + (b === cur ? " selected" : "") + ">" + esc(b.date) + "</option>"; }).join("") + "</select></label></div>" +
        (sample ? '<div class="card callout"><div class="grow small"><b>Sample briefing.</b> This is placeholder content until the first agent run is set up (see the README). Real briefings replace it automatically each morning.</div></div>' : "") +
        (cur.tldr ? '<p class="lead brief-tldr">' + esc(s(cur.tldr, 500)) + "</p>" : "") +
        (cur.for_you ? '<div class="card callout"><div class="grow"><div class="eyebrow">For you</div>' + esc(s(cur.for_you, 400)) + "</div></div>" : "") +
        '<div class="stack">' + cur.items.map(itemHtml).join("") + "</div>" +
        '<div class="card" style="margin-top:16px"><div class="eyebrow">Teach your agents</div><div class="row"><a class="btn" id="fbSend" target="_blank" rel="noopener" href="' + esc(feedbackUrl()) + '">Send feedback</a><span class="small muted" id="fbNote"></span></div></div>' +
        '<details class="card" style="margin-top:12px"><summary><b>Personalize with the poll</b> <span class="muted small">(5 questions)</span></summary>' + H.poll.html() + "</details>" +
        '<div style="margin-top:12px">' + changelogHtml() + "</div></div>";

      function note() {
        var n = pending().length, b = H.$("#fbSend", el), t = H.$("#fbNote", el); if (!b) return;
        b.href = feedbackUrl(); b.classList.toggle("primary", n > 0);
        t.textContent = n ? n + " vote" + (n === 1 ? "" : "s") + " ready to send. Opens a prefilled GitHub Issue." : "Vote on items above, then send them here.";
      }
      note();
      var root = H.$(".page", el);   // listeners live on this page's own element, so re-renders never stack handlers
      H.poll.bind(root);
      root.addEventListener("change", function (ev) { if (ev.target.id === "bsel") H.go("briefing", "d=" + ev.target.value); });
      root.addEventListener("click", function (ev) {
        var t = ev.target.closest && ev.target.closest("button[data-vote]");
        if (t) {
          var id = t.closest(".brief-item").dataset.id, f = H.store.feedback;
          if (f.votes[id] === t.dataset.vote) delete f.votes[id]; else f.votes[id] = t.dataset.vote;
          H.touch(); H.save();
          H.$$("button[data-vote]", t.parentNode).forEach(function (b) { b.classList.toggle("on", f.votes[id] === b.dataset.vote); });
          note(); return;
        }
        if (ev.target.id === "fbSend") { var p = pending(); p.forEach(function (x) { H.store.feedback.sent[x.item] = x.vote; }); H.store.feedback.sentAt = Date.now(); H.save(); setTimeout(note, 0); }
      });
    }
  };
})();
