// CAF Practice Tests: bank loading, timed/untimed runs, instant feedback, domain accuracy, drills, history.
(function () {
  "use strict";
  var H = Hub, esc = H.esc, LET = "ABCDE";
  var DOMAINS = {
    1: "Agentic Architecture & Orchestration", 2: "Tool Design & MCP Integration", 3: "Claude Code Configuration & Workflows",
    4: "Prompt Engineering & Structured Output", 5: "Context Management & Reliability"
  };
  var WEIGHT = { 1: 27, 2: 18, 3: 20, 4: 20, 5: 15 };
  var SCEN = {
    1: { name: "Customer Support Resolution Agent", text: "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate." },
    2: { name: "Code Generation with Claude Code", text: "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution." },
    3: { name: "Multi-Agent Research System", text: "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports." },
    4: { name: "Developer Productivity with Claude", text: "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with MCP servers." },
    5: { name: "Claude Code for Continuous Integration", text: "You are integrating Claude Code into your CI/CD pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives." },
    6: { name: "Structured Data Extraction", text: "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems." }
  };
  var PASS_PCT = 69; // scaled 720 ≈ 100 + 900 × 0.689
  var scaled = function (p) { return Math.round(100 + 900 * p); };
  H.DOMAINS = DOMAINS; H.PASS_PCT = PASS_PCT;

  // ---------- stats ----------
  function pool() {
    var out = [];
    H.banks.forEach(function (b) { b.questions.forEach(function (q, i) { out.push({ b: b.id, i: i, q: q }); }); });
    return out;
  }
  function getQ(ref) { var b = H.banks.filter(function (x) { return x.id === ref.b; })[0]; return b && b.questions[ref.i]; }
  // Recent accuracy per domain from the answer log (last 40 answers per domain) plus all-time.
  H.domainStats = function () {
    var log = H.store.tests.log, res = {};
    Object.keys(DOMAINS).forEach(function (d) { res[d] = { n: 0, c: 0, rn: 0, rc: 0 }; });
    for (var i = log.length - 1; i >= 0; i--) {
      var r = log[i], d = String(r[1]); if (!res[d]) continue;
      res[d].n++; if (r[2]) res[d].c++;
      if (res[d].rn < 40) { res[d].rn++; if (r[2]) res[d].rc++; }
    }
    return res;
  };
  H.weakestDomains = function () {
    var st = H.domainStats();
    return Object.keys(st).filter(function (d) { return st[d].rn >= 5; })
      .sort(function (a, b) { return st[a].rc / st[a].rn - st[b].rc / st[b].rn; });
  };
  function missedRefs() {
    var q = H.store.tests.q, out = [];
    pool().forEach(function (r) { var s = q[r.q.key]; if (s && s.last === false) out.push(r); });
    return out;
  }

  // ---------- attempt model ----------
  // attempt = { label, kind, timed, items:[{b,i}], perms:{pos:[orig idx...]}, ans:{pos:{sel,ok}}, cur, remaining, started, deadline }
  function startAttempt(label, kind, items, timed) {
    var perms = {};
    items.forEach(function (r, pos) { perms[pos] = H.shuffle(getQ(r).o.map(function (_, k) { return k; })); });
    var at = { label: label, kind: kind, timed: timed, items: items, perms: perms, ans: {}, cur: 0,
      remaining: timed ? items.length * 120 : 0, started: Date.now(), deadline: 0 };
    H.store.tests.inProgress = at; H.save();
    return at;
  }
  function bankItems(bank) {
    // Group by scenario like the real exam; shuffle scenario order and question order within each scenario.
    var by = {};
    bank.questions.forEach(function (q, i) { (by[q.s] = by[q.s] || []).push({ b: bank.id, i: i }); });
    return Object.keys(by).sort(function () { return Math.random() - 0.5; }).reduce(function (acc, s) { return acc.concat(H.shuffle(by[s])); }, []);
  }
  function drillItems(domain, n) {
    var q = H.store.tests.q;
    var cand = pool().filter(function (r) { return !domain || r.q.d === +domain; });
    // priority: previously missed, then unseen, then the rest
    function rank(r) { var s = q[r.q.key]; return !s ? 1 : s.last === false ? 0 : 2; }
    cand = H.shuffle(cand).sort(function (a, b) { return rank(a) - rank(b); });
    return cand.slice(0, n).map(function (r) { return { b: r.b, i: r.i }; });
  }

  var screen = "home", tick = null, kbd = null, selection = [];
  function stopTimer() {
    if (tick) { clearInterval(tick); tick = null; }
    if (kbd) { document.removeEventListener("keydown", kbd); kbd = null; }
  }
  function pauseAttempt() {
    var at = H.store.tests.inProgress;
    if (at && at.timed && at.deadline) { at.remaining = Math.max(0, Math.round((at.deadline - Date.now()) / 1000)); at.deadline = 0; }
    H.save();
  }
  function fmt(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return (h ? h + ":" : "") + String(m).padStart(h ? 2 : 1, "0") + ":" + String(s).padStart(2, "0"); }

  // ---------- views ----------
  var view = {
    leave: function () { pauseAttempt(); stopTimer(); },
    render: function (el, params) {
      stopTimer();
      var st = H.store.tests;
      if (params && params.drill != null) {
        // started from the dashboard link: #/tests?drill=3 (domain) or drill=all / missed
        var n = 15, items, label;
        if (params.drill === "missed") { items = H.shuffle(missedRefs()).slice(0, 25).map(function (r) { return { b: r.b, i: r.i }; }); label = "Missed-question review"; }
        else { items = drillItems(params.drill === "all" ? 0 : params.drill, n); label = params.drill === "all" ? "Mixed drill" : "Drill: " + DOMAINS[params.drill]; }
        try { history.replaceState(null, "", "#/tests"); } catch (e) { /* some file:// contexts block this; harmless */ }
        if (items.length) { startAttempt(label, "drill", items, false); screen = "run"; }
      }
      if (screen === "run" && st.inProgress) return renderRun(el);
      if (screen === "result" && view.last) return renderResult(el, view.last);
      screen = "home";
      renderHome(el);
    }
  };
  H.views.tests = view;

  function renderHome(el) {
    var st = H.store.tests, dst = H.domainStats(), weak = H.weakestDomains();
    var banks = H.banks.map(function (b) {
      var hist = st.attempts.filter(function (a) { return a.bank === b.id; });
      var best = hist.length ? Math.max.apply(null, hist.map(function (a) { return a.pct; })) : null;
      var scen = {}; b.questions.forEach(function (q) { if (q.s) scen[q.s] = 1; });
      return '<div class="card bank"><div class="grow"><h3>' + esc(b.title) + '</h3><div class="muted small">' + b.questions.length + " questions" +
        (Object.keys(scen).length ? " · " + Object.keys(scen).length + " scenarios" : "") + (hist.length ? " · best " + best + "% · " + hist.length + " attempt" + (hist.length > 1 ? "s" : "") : "") + "</div>" +
        '<div class="tags">' + Object.keys(scen).map(function (s) { return '<span class="tag">' + esc((SCEN[s] || { name: "Scenario " + s }).name) + "</span>"; }).join("") + "</div></div>" +
        '<div class="row"><button class="btn primary" data-bank="' + esc(b.id) + '" data-timed="1">Timed</button><button class="btn" data-bank="' + esc(b.id) + '" data-timed="0">Untimed</button></div></div>';
    }).join("");
    var dom = Object.keys(DOMAINS).map(function (d) {
      var s = dst[d], p = s.rn ? H.pct(s.rc, s.rn) : null;
      var color = p == null ? "var(--line)" : p >= 75 ? "var(--ok)" : p >= PASS_PCT ? "var(--warn)" : "var(--bad)";
      var isWeak = weak.length && (d === weak[0] || d === weak[1]) && p != null && p < 75;
      return '<div class="dom"><div class="dom-top"><span><b>D' + d + "</b> " + esc(DOMAINS[d]) + (isWeak ? ' <span class="chip bad">drill this</span>' : "") + '</span><span class="muted small">' +
        (p == null ? "no data" : p + "% · last " + s.rn + " answers") + " · exam weight " + WEIGHT[d] + '%</span></div>' + H.bar(p == null ? 0 : p, color) +
        '<div class="dom-act"><button class="btn small" data-drill="' + d + '">Drill 15</button></div></div>';
    }).join("");
    var missed = missedRefs().length;
    var recent = st.attempts.slice(-8).reverse().map(function (a) {
      return "<tr><td>" + H.fmtDate(a.ts) + "</td><td>" + esc(a.label) + "</td><td>" + (a.timed ? "Timed" : "Untimed") + "</td><td>" + a.correct + "/" + a.total + "</td><td><b>" + a.pct + "%</b></td><td>" + (a.kind === "bank" ? (scaled(a.pct / 100) >= 720 ? '<span class="chip ok">pass pace</span>' : '<span class="chip bad">below</span>') : "") + "</td></tr>";
    }).join("");
    var inprog = st.inProgress;
    el.innerHTML = '<div class="page"><h1>CAF Practice Tests</h1><p class="lead">Scenario-based questions with instant feedback. Every answer feeds the domain accuracy below — that panel tells you exactly what to drill.</p>' +
      (inprog ? '<div class="card callout"><div class="grow"><b>In progress:</b> ' + esc(inprog.label) + " — " + Object.keys(inprog.ans).length + "/" + inprog.items.length + ' answered</div><button class="btn primary" id="resume">Resume</button><button class="btn ghost" id="abandon">Discard</button></div>' : "") +
      '<h2>Full banks</h2><div class="stack">' + (banks || '<div class="empty">No question banks found. Add q1.js next to index.html (see format below).</div>') + "</div>" +
      '<h2>Domain accuracy — your weak spots</h2><div class="card">' + dom +
      '<div class="row" style="margin-top:14px"><button class="btn" data-drill="all">Mixed drill (15)</button><button class="btn" data-drill="missed"' + (missed ? "" : " disabled") + ">Review missed (" + missed + ")</button></div>" +
      '<p class="muted small" style="margin:10px 0 0">Scaled pass mark is 720/1000 ≈ ' + PASS_PCT + '% correct here. Aim for 75%+ in every domain to leave margin. Drills prioritise questions you missed, then ones you haven’t seen.</p></div>' +
      '<h2>Score history</h2><div class="card">' + H.trendSVG(st.attempts.slice(-12).map(function (a) { return a.pct; }), PASS_PCT) +
      (recent ? '<table class="tbl"><thead><tr><th>Date</th><th>Test</th><th>Mode</th><th>Score</th><th>%</th><th></th></tr></thead><tbody>' + recent + "</tbody></table>" : "") + "</div>" +
      (H.warnings.length ? '<div class="card warnbox"><b>Bank warnings</b><ul>' + H.warnings.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul></div>" : "") +
      '<details class="card"><summary><b>Adding a question bank</b> — drop in a new file, no code changes</summary>' +
      '<p class="small">Create <code>q4.js</code> (or q5, q6… numbered with no gaps larger than one) next to <code>index.html</code> in the same format as <code>q1.js</code>. It is picked up automatically on next load. Fields: <code>s</code> scenario 1–6 · <code>d</code> domain 1–5 (drives the accuracy panel) · <code>q</code> question · <code>o</code> options with the correct one(s) first (shuffled at runtime; keep them the same length) · <code>a</code> indexes of correct options, e.g. <code>[0]</code> or <code>[0,1]</code> for select-two · <code>e</code> explanation.</p></details></div>';

    el.onclick = function (ev) {
      var t = ev.target.closest("button"); if (!t) return;
      if (t.dataset.bank != null) {
        var b = H.banks.filter(function (x) { return String(x.id) === t.dataset.bank; })[0];
        var at = startAttempt(b.title, "bank", bankItems(b), t.dataset.timed === "1"); at.bank = b.id;
        screen = "run"; view.render(el, {});
      } else if (t.dataset.drill != null) { H.go("tests", "drill=" + t.dataset.drill); }
      else if (t.id === "resume") { screen = "run"; view.render(el, {}); }
      else if (t.id === "abandon") { H.store.tests.inProgress = null; H.save(); view.render(el, {}); }
    };
  }

  function renderRun(el) {
    var at = H.store.tests.inProgress, total = at.items.length;
    if (at.timed) at.deadline = Date.now() + at.remaining * 1000;
    selection = [];
    var checking = false;

    function draw() {
      var pos = at.cur, ref = at.items[pos], q = getQ(ref), perm = at.perms[pos], a = at.ans[pos];
      var multi = q.a.length > 1, answered = Object.keys(at.ans).length;
      var scen = SCEN[q.s];
      var opts = perm.map(function (orig, k) {
        var cls = "opt", mark = "";
        var picked = a ? a.sel.indexOf(orig) >= 0 : selection.indexOf(orig) >= 0;
        if (picked) cls += " sel";
        if (a) { var right = q.a.indexOf(orig) >= 0; if (right) cls += " right"; else if (picked) cls += " wrong"; mark = right ? '<span class="mk ok">✓</span>' : picked ? '<span class="mk bad">✗</span>' : ""; }
        return '<button class="' + cls + '" data-o="' + orig + '"' + (a ? " disabled" : "") + '><span class="ltr">' + LET[k] + "</span><span class=\"otxt\">" + esc(q.o[orig]) + "</span>" + mark + "</button>";
      }).join("");
      el.innerHTML = '<div class="runbar"><div class="inner"><button class="btn ghost" id="exit">← Save & exit</button><b>' + esc(at.label) + "</b><span class=\"muted small\">" + (at.timed ? "Timed" : "Untimed") + "</span><span class=\"grow\"></span>" +
        (at.timed ? '<span class="timer" id="timer">' + fmt(at.remaining) + "</span>" : "") + '<button class="btn" id="finish">Finish</button></div>' +
        '<div class="inner">' + H.bar((answered / total) * 100) + "</div></div>" +
        '<div class="page narrow"><div class="muted small">Question ' + (pos + 1) + " of " + total + " · " + answered + " answered" + (q.d ? ' · <span class="tag">D' + q.d + " " + esc(DOMAINS[q.d] || "") + "</span>" : "") + "</div>" +
        (scen ? '<details class="scen"><summary>Scenario: ' + esc(scen.name) + "</summary><p>" + esc(scen.text) + "</p></details>" : "") +
        '<div class="card qcard"><div class="qtext">' + esc(q.q) + "</div>" + (multi ? '<div class="chip">Select ' + q.a.length + "</div>" : "") + '<div class="opts">' + opts + "</div>" +
        (a ? '<div class="fb ' + (a.ok ? "ok" : "bad") + '"><b>' + (a.ok ? "Correct" : "Not quite") + "</b><p>" + esc(q.e || "No explanation provided for this question.") + "</p></div>" : "") + "</div>" +
        '<div class="row between"><button class="btn" id="prev"' + (pos === 0 ? " disabled" : "") + ">← Prev</button>" +
        (a ? "" : '<button class="btn primary" id="check"' + (selection.length === q.a.length ? "" : " disabled") + ">Check answer</button>") +
        '<button class="btn' + (a ? " primary" : "") + '" id="next"' + (pos === total - 1 ? " disabled" : "") + ">Next →</button></div>" +
        '<p class="muted small center">Keys: A–E choose · Enter check / next · ← → move</p></div>';
    }
    function check() {
      var pos = at.cur, q = getQ(at.items[pos]);
      if (at.ans[pos] || selection.length !== q.a.length) return;
      var ok = selection.slice().sort().join() === q.a.slice().sort().join();
      at.ans[pos] = { sel: selection.slice(), ok: ok };
      var t = H.store.tests, s = t.q[q.key] || { n: 0, c: 0 };
      s.n++; if (ok) s.c++; s.last = ok; t.q[q.key] = s;
      t.log.push([Date.now(), q.d, ok ? 1 : 0]); if (t.log.length > 4000) t.log.splice(0, t.log.length - 4000);
      t.answered++; H.touch(); selection = []; H.save(); draw();
    }
    function go(d) { var n = at.cur + d; if (n < 0 || n >= total) return; at.cur = n; selection = []; H.save(); draw(); window.scrollTo(0, 0); }
    function finish() {
      var unanswered = total - Object.keys(at.ans).length;
      if (unanswered && !confirmTwice("finish", "Finish with " + unanswered + " unanswered? Click Finish again to confirm.")) return;
      stopTimer(); finalize(el, at);
    }
    var armed = null;
    function confirmTwice(id, msg) { if (armed === id) return true; armed = id; var b = H.$("#finish"); if (b) b.textContent = "Confirm finish"; var n = H.$(".muted.small.center"); if (n) n.textContent = msg; setTimeout(function () { armed = null; var b2 = H.$("#finish"); if (b2) b2.textContent = "Finish"; }, 4000); return false; }

    el.onclick = function (ev) {
      var t = ev.target.closest("button"); if (!t || t.disabled) return;
      if (t.dataset.o != null) {
        var q = getQ(at.items[at.cur]), o = +t.dataset.o, i = selection.indexOf(o);
        if (q.a.length === 1) selection = [o]; else if (i >= 0) selection.splice(i, 1); else if (selection.length < q.a.length) selection.push(o);
        draw();
      } else if (t.id === "check") check(); else if (t.id === "next") go(1); else if (t.id === "prev") go(-1);
      else if (t.id === "finish") finish();
      else if (t.id === "exit") { pauseAttempt(); stopTimer(); screen = "home"; view.render(el, {}); }
    };
    kbd = function (e) {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      var pos = at.cur, q = getQ(at.items[pos]), a = at.ans[pos];
      var k = LET.indexOf(e.key.toUpperCase());
      if (e.key.length === 1 && k >= 0 && k < at.perms[pos].length && !a) {
        var o = at.perms[pos][k], i = selection.indexOf(o);
        if (q.a.length === 1) selection = [o]; else if (i >= 0) selection.splice(i, 1); else if (selection.length < q.a.length) selection.push(o);
        draw();
      } else if (e.key === "Enter") { e.preventDefault(); if (!a) check(); else go(1); }
      else if (e.key === "ArrowRight") go(1); else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", kbd);
    if (at.timed) {
      tick = setInterval(function () {
        at.remaining = Math.max(0, Math.round((at.deadline - Date.now()) / 1000));
        var t = H.$("#timer"); if (t) { t.textContent = fmt(at.remaining); t.classList.toggle("low", at.remaining < 300); }
        if (at.remaining <= 0) { stopTimer(); finalize(el, at); }
      }, 500);
    }
    draw();
  }

  function finalize(el, at) {
    var total = at.items.length, correct = 0, dom = {};
    at.items.forEach(function (ref, pos) {
      var q = getQ(ref), a = at.ans[pos], d = q.d || 0;
      dom[d] = dom[d] || [0, 0]; dom[d][1]++;
      if (a && a.ok) { correct++; dom[d][0]++; }
    });
    var rec = { ts: Date.now(), label: at.label, kind: at.kind, bank: at.bank == null ? null : at.bank, timed: at.timed, total: total, correct: correct,
      pct: H.pct(correct, total), dom: dom, secs: Math.round((Date.now() - at.started) / 1000) };
    H.store.tests.attempts.push(rec);
    H.store.tests.inProgress = null; H.touch(); H.save();
    view.last = { rec: rec, at: at }; screen = "result"; view.render(el, {});
  }

  function renderResult(el, res) {
    var r = res.rec, at = res.at, sc = scaled(r.correct / r.total);
    var passed = sc >= 720 && r.kind === "bank";
    var rows = Object.keys(r.dom).sort().map(function (d) {
      var c = r.dom[d][0], n = r.dom[d][1], p = H.pct(c, n);
      return '<div class="dom"><div class="dom-top"><span><b>' + (d === "0" ? "Uncategorised" : "D" + d + "</b> " + esc(DOMAINS[d] || "")) + '</span><span class="muted small">' + c + "/" + n + " · " + p + "%</span></div>" +
        H.bar(p, p >= 75 ? "var(--ok)" : p >= PASS_PCT ? "var(--warn)" : "var(--bad)") + "</div>";
    }).join("");
    var wrong = at.items.map(function (ref, pos) { return { pos: pos, q: getQ(ref), a: at.ans[pos] }; }).filter(function (x) { return !(x.a && x.a.ok); });
    var review = wrong.map(function (x) {
      var right = x.q.a.map(function (i) { return esc(x.q.o[i]); }).join("<br>");
      return '<details class="card"><summary>' + esc(x.q.q.slice(0, 140)) + (x.q.q.length > 140 ? "…" : "") + (x.a ? "" : ' <span class="chip bad">unanswered</span>') + '</summary><p class="small"><b>Correct:</b><br>' + right + '</p><p class="small muted">' + esc(x.q.e) + "</p></details>";
    }).join("");
    el.innerHTML = '<div class="page narrow"><h1>' + esc(r.label) + ' — results</h1><div class="card hero ' + (passed ? "ok" : "") + '"><div class="big">' + r.pct + '%</div><div><b>' + r.correct + " / " + r.total + " correct</b><div class=\"muted\">" +
      (r.kind === "bank" ? "≈ " + sc + "/1000 scaled · pass is 720 · " + (passed ? "you would pass at this pace" : "below the pass line") : "Drill — doesn’t count toward the pass estimate") + "</div></div></div>" +
      "<h2>By domain</h2><div class=\"card\">" + rows + "</div>" +
      (wrong.length ? "<h2>Review (" + wrong.length + ")</h2>" + review : '<div class="card">Clean sweep. 🔥</div>') +
      '<div class="row" style="margin-top:20px"><button class="btn primary" id="done">Back to tests</button>' + (wrong.length ? '<button class="btn" id="redo">Drill my misses</button>' : "") + "</div></div>";
    el.onclick = function (ev) {
      var t = ev.target.closest("button"); if (!t) return;
      if (t.id === "done") { screen = "home"; view.last = null; view.render(el, {}); }
      if (t.id === "redo") { var items = wrong.filter(function (x) { return x.q; }).map(function (x) { return at.items[x.pos]; }); startAttempt("Retry misses", "drill", items, false); screen = "run"; view.last = null; view.render(el, {}); }
    };
  }
})();
