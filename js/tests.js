// CAF Practice Tests: exam-style interface (Exam / Study modes), domain accuracy, drills, score history.
// Questions come from q1.js, q2.js, ... (see the format at the top of q1.js).
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
  var scenName = function (s) { return (SCEN[s] || { name: "Scenario " + s }).name; };
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
  function record(q, ok) {
    var t = H.store.tests, s = t.q[q.key] || { n: 0, c: 0 };
    s.n++; if (ok) s.c++; s.last = ok; t.q[q.key] = s;
    t.log.push([Date.now(), q.d, ok ? 1 : 0]); if (t.log.length > 4000) t.log.splice(0, t.log.length - 4000);
    t.answered++; H.touch();
  }

  // ---------- attempt model ----------
  // at = { label, kind:"bank"|"drill", mode:"exam"|"study", bank, items:[{b,i}], perms:{pos:[orig idx]}, ans:{pos:[orig idx]},
  //        checked:{pos:true}, flags:{pos:true}, cur, remaining(sec), started, deadline }
  function startAttempt(label, kind, items, mode, bank) {
    var perms = {};
    items.forEach(function (r, pos) { perms[pos] = H.shuffle(getQ(r).o.map(function (_, k) { return k; })); });
    var at = { label: label, kind: kind, mode: mode, bank: bank == null ? null : bank, items: items, perms: perms, ans: {}, checked: {}, flags: {},
      cur: 0, remaining: mode === "exam" ? items.length * 120 : 0, started: Date.now(), deadline: 0 };
    H.store.tests.inProgress = at; H.save();
    return at;
  }
  function bankItems(bank) {
    // Group by scenario like the real exam; shuffle scenario order and question order within each scenario.
    var by = {};
    bank.questions.forEach(function (q, i) { (by[q.s] = by[q.s] || []).push({ b: bank.id, i: i }); });
    return H.shuffle(Object.keys(by)).reduce(function (acc, s) { return acc.concat(H.shuffle(by[s])); }, []);
  }
  function drillItems(domain, n) {
    var q = H.store.tests.q;
    var cand = pool().filter(function (r) { return !domain || r.q.d === +domain; });
    function rank(r) { var s = q[r.q.key]; return !s ? 1 : s.last === false ? 0 : 2; } // missed, then unseen, then the rest
    cand = H.shuffle(cand).sort(function (a, b) { return rank(a) - rank(b); });
    return cand.slice(0, n).map(function (r) { return { b: r.b, i: r.i }; });
  }
  function isAnswered(at, pos) { return !!(at.ans[pos] && at.ans[pos].length === getQ(at.items[pos]).a.length); }
  function isRight(q, ans) { return !!ans && ans.length === q.a.length && ans.every(function (x) { return q.a.indexOf(x) >= 0; }); }

  var screen = "home", tick = null, kbd = null;
  function stopTimer() {
    if (tick) { clearInterval(tick); tick = null; }
    if (kbd) { document.removeEventListener("keydown", kbd); kbd = null; }
    var m = H.$(".x-modal-bg"); if (m) m.remove();
  }
  function pauseAttempt() {
    var at = H.store.tests.inProgress;
    if (at && at.mode === "exam" && at.deadline) { at.remaining = Math.max(0, Math.round((at.deadline - Date.now()) / 1000)); at.deadline = 0; }
    H.save();
  }
  function fmt(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return (h ? h + ":" : "") + String(m).padStart(h ? 2 : 1, "0") + ":" + String(s).padStart(2, "0"); }

  // ---------- view ----------
  var view = {
    leave: function () { pauseAttempt(); stopTimer(); document.body.classList.remove("exam-skin"); },
    render: function (el, params) {
      stopTimer();
      document.body.classList.add("exam-skin");
      var st = H.store.tests;
      if (params && params.drill != null) { // started from the dashboard link: #/tests?drill=3 | all | missed
        var items, label;
        if (params.drill === "missed") { items = H.shuffle(missedRefs()).slice(0, 25).map(function (r) { return { b: r.b, i: r.i }; }); label = "Missed-question review"; }
        else { items = drillItems(params.drill === "all" ? 0 : params.drill, 15); label = params.drill === "all" ? "Mixed drill" : "Drill: " + DOMAINS[params.drill]; }
        try { history.replaceState(null, "", "#/tests"); } catch (e) { /* some file:// contexts block this; harmless */ }
        if (items.length) { startAttempt(label, "drill", items, "study"); screen = "run"; }
      }
      if (screen === "run" && st.inProgress) return renderRun(el);
      if (screen === "result" && view.last) return renderResult(el, view.last);
      screen = "home";
      renderHome(el);
    }
  };
  H.views.tests = view;

  function renderHome(el) {
    var st = H.store.tests, dst = H.domainStats(), weak = H.weakestDomains(), mode = st.mode || "exam";
    var cards = H.banks.map(function (b) {
      var hist = st.attempts.filter(function (a) { return a.bank === b.id; });
      var best = hist.length ? Math.max.apply(null, hist.map(function (a) { return a.pct; })) : null;
      var last = hist.length ? hist[hist.length - 1] : null;
      var scen = {}; b.questions.forEach(function (q) { if (q.s) scen[q.s] = 1; });
      var prog = st.inProgress && st.inProgress.kind === "bank" && st.inProgress.bank === b.id ? st.inProgress : null;
      return '<div class="x-card x-test"><div><h2>' + esc(b.title) + '</h2><div class="x-muted x-small">' + b.questions.length + " questions" +
        (Object.keys(scen).length ? " · " + Object.keys(scen).length + " scenarios" : "") + " · " + b.questions.length * 2 + " min</div>" +
        '<div class="x-tags">' + Object.keys(scen).map(function (s) { return '<span class="x-tag">' + esc(scenName(s)) + "</span>"; }).join("") + "</div>" +
        (hist.length ? '<div class="x-history">Best ' + best + "% (≈" + scaled(best / 100) + ") · Last " + last.pct + "% · " + hist.length + " attempt" + (hist.length > 1 ? "s" : "") + "</div>" : "") + "</div>" +
        '<div class="x-row">' + (prog ? '<button class="btn" id="resume">Resume (' + Object.keys(prog.ans).length + "/" + prog.items.length + ")</button>" : "") +
        '<button class="btn primary" data-bank="' + esc(b.id) + '">' + (prog ? "Restart" : "Start") + "</button></div></div>";
    }).join("");
    var otherProg = st.inProgress && st.inProgress.kind !== "bank" ? st.inProgress : null;

    var dom = Object.keys(DOMAINS).map(function (d) {
      var s = dst[d], p = s.rn ? H.pct(s.rc, s.rn) : null;
      var color = p == null ? "var(--line)" : p >= 75 ? "var(--ok)" : p >= PASS_PCT ? "var(--warn)" : "var(--bad)";
      var isWeak = weak.length && (d === weak[0] || d === weak[1]) && p != null && p < 75;
      return '<div class="x-dom"><div class="x-dom-top"><span><b>D' + d + "</b> " + esc(DOMAINS[d]) + (isWeak ? ' <span class="x-badge bad">drill this</span>' : "") + '</span><span class="x-muted x-small">' +
        (p == null ? "no data yet" : p + "% · last " + s.rn + " answers") + " · exam weight " + WEIGHT[d] + "%</span></div>" +
        '<div class="x-bar-row"><div class="x-track"><div class="x-fill" style="width:' + (p == null ? 0 : p) + "%;background:" + color + '"></div></div><button class="btn x-sm" data-drill="' + d + '">Drill 15</button></div></div>';
    }).join("");
    var missed = missedRefs().length;
    var rows = st.attempts.slice(-8).reverse().map(function (a) {
      return "<tr><td>" + H.fmtDate(a.ts) + "</td><td>" + esc(a.label) + "</td><td>" + (a.mode === "exam" ? "Exam" : "Study") + "</td><td>" + a.correct + "/" + a.total + "</td><td><b>" + a.pct + "%</b></td><td>" +
        (a.kind === "bank" ? (scaled(a.pct / 100) >= 720 ? '<span class="x-badge ok">pass pace</span>' : '<span class="x-badge bad">below</span>') : "") + "</td></tr>";
    }).join("");

    el.innerHTML = '<div class="x-wrap"><span class="x-pill"><span class="x-dot"></span>CCAR-F · Unofficial practice</span><h1 class="x-h1">Practice exams</h1>' +
      '<p class="x-lead">Scenario-based tests modeled on the CCAR-F exam guide. Answer options are length-balanced and shuffled each attempt. Every answer feeds the domain accuracy below, so you always know what to drill.</p>' +
      '<p class="x-muted x-small" style="margin:-16px 0 24px">Independent study material written from the public CCAR-F exam guide. Not affiliated with or endorsed by Anthropic, and not actual exam content.</p>' +
      '<div class="x-row" style="margin-bottom:18px"><div class="x-seg"><button data-mode="exam" class="' + (mode === "exam" ? "on" : "") + '">Exam mode</button><button data-mode="study" class="' + (mode === "study" ? "on" : "") + '">Study mode</button></div>' +
      '<span class="x-muted x-small">' + (mode === "exam" ? "Timed (2 min per question), no feedback until you submit — like the real thing." : "Untimed. Check each answer and read the explanation immediately.") + "</span></div>" +
      (otherProg ? '<div class="x-card x-test" style="margin-bottom:14px"><div><b>In progress:</b> ' + esc(otherProg.label) + " — " + Object.keys(otherProg.ans).length + "/" + otherProg.items.length + ' answered</div><div class="x-row"><button class="btn primary" id="resume">Resume</button><button class="btn ghost" id="abandon">Discard</button></div></div>' : "") +
      '<div class="x-cards">' + (cards || '<div class="x-card x-muted">No question banks found. Add q1.js next to index.html (format is at the top of q1.js).</div>') + "</div><hr class=\"x-hr\">" +
      '<div class="x-card"><h2>Domain accuracy — your weak spots</h2><div style="margin-top:10px">' + dom + "</div>" +
      '<div class="x-row" style="margin-top:14px"><button class="btn" data-drill="all">Mixed drill (15)</button><button class="btn" data-drill="missed"' + (missed ? "" : " disabled") + ">Review missed (" + missed + ")</button></div>" +
      '<p class="x-muted x-small" style="margin:12px 0 0">Passing is a scaled 720/1000 ≈ ' + PASS_PCT + "% correct here (100 + 900 × percent; Anthropic’s real scaling isn’t published), so aim for 75%+ in every domain. Drills pick questions you missed first, then ones you haven’t seen.</p></div>" +
      '<div class="x-card" style="margin-top:14px"><h2>Score history</h2>' + H.trendSVG(st.attempts.slice(-12).map(function (a) { return a.pct; }), PASS_PCT) +
      (rows ? '<table class="x-tbl"><thead><tr><th>Date</th><th>Test</th><th>Mode</th><th>Score</th><th>%</th><th></th></tr></thead><tbody>' + rows + "</tbody></table>" : "") + "</div>" +
      (H.warnings.length ? '<div class="x-card" style="margin-top:14px;border-color:var(--warn)"><b>Bank warnings</b><ul>' + H.warnings.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul></div>" : "") + "</div>";

    el.onclick = function (ev) {
      var t = ev.target.closest("button"); if (!t) return;
      if (t.dataset.mode) { st.mode = t.dataset.mode; H.save(); renderHome(el); }
      else if (t.dataset.bank != null) {
        var b = H.banks.filter(function (x) { return String(x.id) === t.dataset.bank; })[0];
        startAttempt(b.title, "bank", bankItems(b), mode, b.id); screen = "run"; view.render(el, {});
      } else if (t.dataset.drill != null) { H.go("tests", "drill=" + t.dataset.drill); }
      else if (t.id === "resume") { screen = "run"; view.render(el, {}); }
      else if (t.id === "abandon") { H.store.tests.inProgress = null; H.save(); renderHome(el); }
    };
  }

  // ---------- running a test ----------
  function renderRun(el) {
    var at = H.store.tests.inProgress, total = at.items.length, study = at.mode === "study";
    if (!study) at.deadline = Date.now() + at.remaining * 1000;

    el.innerHTML = '<div class="x-topbar"><div class="x-inner"><button class="btn ghost" id="home" title="Save and exit">← Exit</button><strong>' + esc(at.label) + '</strong><span class="x-muted x-small">' + (study ? "Study mode" : "Exam mode") + "</span>" +
      '<span class="x-spacer"></span>' + (study ? "" : '<span class="x-timer" id="timer"></span>') + '<button class="btn" id="toggleNav">Questions</button><button class="btn primary" id="submit">Submit</button></div>' +
      '<div class="x-inner x-thin"><div class="x-progress"><div id="prog"></div></div></div></div>' +
      '<div class="x-wrap" style="padding-top:8px"><div id="navPanel" class="x-card x-hidden" style="margin-top:16px"><div class="x-row"><strong>Jump to question</strong><span class="x-spacer"></span><span class="x-muted x-small" id="navCount"></span></div>' +
      '<div class="x-grid" id="grid"></div><div class="x-legend"><span style="--sw:var(--panel2)">Answered</span><span style="--sw:var(--warn)">Flagged</span><span style="--sw:var(--accent)">Current</span></div></div>' +
      '<div id="qArea"></div><div class="x-kbd">Shortcuts: <kbd>A</kbd>–<kbd>E</kbd> select · <kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>F</kbd> flag' + (study ? " · <kbd>Enter</kbd> check" : "") + "</div></div>";

    H.$("#home").onclick = function () { pauseAttempt(); stopTimer(); screen = "home"; view.render(el, {}); };
    H.$("#toggleNav").onclick = function () { H.$("#navPanel").classList.toggle("x-hidden"); };
    H.$("#submit").onclick = function () { confirmSubmit(el, at); };

    if (!study) {
      var paint = function () {
        var t = H.$("#timer"); if (!t) return;
        t.textContent = "⏱ " + fmt(at.remaining); t.classList.toggle("low", at.remaining < 600);
      };
      paint();
      tick = setInterval(function () {
        at.remaining = Math.max(0, Math.round((at.deadline - Date.now()) / 1000)); paint();
        if (at.remaining % 5 === 0) H.save();
        if (at.remaining <= 0) { stopTimer(); finalize(el, at, true); }
      }, 1000);
    }
    kbd = function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey || H.$(".x-modal-bg")) return;
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      var k = e.key.toLowerCase(), opts = H.$$("#qArea .x-opt");
      var idx = "abcde".indexOf(k); if (idx < 0) idx = "12345".indexOf(k);
      if (e.key.length === 1 && idx >= 0 && opts[idx] && !opts[idx].disabled) { opts[idx].click(); e.preventDefault(); return; }
      if (e.key === "ArrowRight") { var n = H.$("#next"); if (n && !/Finish/.test(n.textContent)) n.click(); }
      else if (e.key === "ArrowLeft") { var p = H.$("#prev"); if (p && !p.disabled) p.click(); }
      else if (k === "f") { var f = H.$("#flag"); if (f) f.click(); }
      else if (e.key === "Enter") { var c = H.$("#check"); if (c && !c.disabled) { c.click(); e.preventDefault(); } }
    };
    document.addEventListener("keydown", kbd);
    draw(el, at);
  }

  function draw(el, at) {
    var study = at.mode === "study", total = at.items.length, pos = at.cur, ref = at.items[pos], q = getQ(ref), perm = at.perms[pos];
    var multi = q.a.length > 1, ans = at.ans[pos] || [], checked = study && at.checked[pos];
    var prev = pos > 0 ? getQ(at.items[pos - 1]) : null, firstOfScenario = !prev || prev.s !== q.s;
    var answered = Object.keys(at.ans).filter(function (k) { return isAnswered(at, +k); }).length;
    H.$("#prog").style.width = (answered / total) * 100 + "%";

    var opts = perm.map(function (orig, k) {
      var cls = "x-opt", sel = ans.indexOf(orig) >= 0;
      if (checked) { if (q.a.indexOf(orig) >= 0) cls += " correct"; else if (sel) cls += " wrong"; } else if (sel) cls += " sel";
      return '<button class="' + cls + '" data-orig="' + orig + '"' + (checked ? " disabled" : "") + '><span class="x-key">' + LET[k] + "</span><span>" + esc(q.o[orig]) + "</span></button>";
    }).join("");
    var explain = "";
    if (checked) {
      var ok = isRight(q, ans), letters = perm.map(function (o, k) { return q.a.indexOf(o) >= 0 ? LET[k] : null; }).filter(Boolean).join(" & ");
      explain = '<div class="x-explain"><div class="x-verdict ' + (ok ? "ok" : "bad") + '">' + (ok ? "Correct" : "Incorrect — answer: " + letters) + "</div>" + esc(q.e || "No explanation provided for this question.") + "</div>";
    }
    var scen = SCEN[q.s];
    H.$("#qArea").innerHTML = (scen ? '<details class="x-scenario"' + (firstOfScenario ? " open" : "") + "><summary>Scenario: " + esc(scen.name) + "</summary><p>" + esc(scen.text) + "</p></details>" : '<div style="height:20px"></div>') +
      '<div class="x-qmeta"><span>Question ' + (pos + 1) + " of " + total + "</span>" + (study && q.d ? "<span>·</span><span>D" + q.d + " " + esc(DOMAINS[q.d] || "") + "</span>" : "") + "</div>" +
      '<p class="x-qtext">' + esc(q.q) + '</p><p class="x-instr">' + (multi ? "Select " + (q.a.length === 2 ? "TWO" : q.a.length) : "Select ONE") + '</p><div class="x-opts">' + opts + "</div>" + explain +
      '<div class="x-navrow"><button class="btn" id="prev"' + (pos === 0 ? " disabled" : "") + '>← Previous</button><button class="btn x-flagbtn' + (at.flags[pos] ? " on" : "") + '" id="flag">' + (at.flags[pos] ? "⚑ Flagged" : "⚐ Flag for review") + '</button><span class="x-spacer"></span>' +
      (study && !checked ? '<button class="btn primary" id="check"' + (ans.length !== q.a.length ? " disabled" : "") + ">Check answer</button>" : "") +
      '<button class="btn' + (study && !checked ? "" : " primary") + '" id="next">' + (pos === total - 1 ? "Finish →" : "Next →") + "</button></div>";

    H.$$("#qArea .x-opt").forEach(function (b) { b.onclick = function () { choose(el, at, +b.dataset.orig); }; });
    H.$("#prev").onclick = function () { go(el, at, pos - 1); };
    H.$("#next").onclick = function () { if (pos === total - 1) confirmSubmit(el, at); else go(el, at, pos + 1); };
    H.$("#flag").onclick = function () { at.flags[pos] = !at.flags[pos]; H.save(); draw(el, at); };
    var chk = H.$("#check");
    if (chk) chk.onclick = function () { at.checked[pos] = true; record(q, isRight(q, at.ans[pos])); at.recorded = at.recorded || {}; at.recorded[pos] = 1; H.save(); draw(el, at); };
    grid(el, at);
  }
  function choose(el, at, orig) {
    var pos = at.cur, q = getQ(at.items[pos]);
    if (at.mode === "study" && at.checked[pos]) return;
    var ans = (at.ans[pos] || []).slice();
    if (q.a.length > 1) { if (ans.indexOf(orig) >= 0) ans = ans.filter(function (x) { return x !== orig; }); else { ans.push(orig); if (ans.length > q.a.length) ans.shift(); } }
    else ans = [orig];
    at.ans[pos] = ans; H.save(); draw(el, at);
  }
  function go(el, at, i) { if (i < 0 || i >= at.items.length) return; at.cur = i; H.save(); draw(el, at); window.scrollTo({ top: 0 }); }
  function grid(el, at) {
    var g = H.$("#grid"); if (!g) return;
    var a = 0, f = 0;
    g.innerHTML = at.items.map(function (_, pos) {
      var cls = "x-cell"; if (isAnswered(at, pos)) { a++; cls += " ans"; } if (at.flags[pos]) { f++; cls += " flag"; } if (pos === at.cur) cls += " cur";
      if (at.mode === "study" && at.checked[pos]) cls += isRight(getQ(at.items[pos]), at.ans[pos]) ? " r-ok" : " r-bad";
      return '<button class="' + cls + '" data-pos="' + pos + '">' + (pos + 1) + "</button>";
    }).join("");
    H.$("#navCount").textContent = a + "/" + at.items.length + " answered · " + f + " flagged";
    H.$$(".x-cell", g).forEach(function (c) { c.onclick = function () { go(el, at, +c.dataset.pos); }; });
  }
  function modal(title, body, ok, onOk) {
    var bg = document.createElement("div");
    bg.className = "x-modal-bg";
    bg.innerHTML = '<div class="x-modal" role="dialog" aria-modal="true"><h2>' + esc(title) + "</h2><p>" + body + '</p><div class="x-row" style="justify-content:flex-end"><button class="btn" id="mCancel">Keep going</button><button class="btn primary" id="mOk">' + esc(ok) + "</button></div></div>";
    document.body.appendChild(bg);
    function close() { bg.remove(); }
    bg.onclick = function (e) { if (e.target === bg) close(); };
    H.$("#mCancel", bg).onclick = close;
    H.$("#mOk", bg).onclick = function () { close(); onOk(); };
    H.$("#mOk", bg).focus();
  }
  function confirmSubmit(el, at) {
    var total = at.items.length, answered = at.items.filter(function (_, p) { return isAnswered(at, p); }).length, flagged = Object.keys(at.flags).filter(function (k) { return at.flags[k]; }).length;
    var msg = "You’ve answered " + answered + " of " + total + " questions.";
    if (total - answered) msg += " <strong>" + (total - answered) + " unanswered</strong> will be marked incorrect.";
    if (flagged) msg += " " + flagged + " flagged for review.";
    modal(at.kind === "bank" ? "Submit exam?" : "Finish this drill?", msg, "Submit", function () { stopTimer(); finalize(el, at, false); });
  }

  function finalize(el, at, timedOut) {
    var total = at.items.length, correct = 0, dom = {}, scn = {}, recorded = at.recorded || {};
    at.items.forEach(function (ref, pos) {
      var q = getQ(ref), ok = isAnswered(at, pos) && isRight(q, at.ans[pos]), d = q.d || 0;
      dom[d] = dom[d] || [0, 0]; dom[d][1]++; if (ok) dom[d][0]++;
      if (q.s) { scn[q.s] = scn[q.s] || [0, 0]; scn[q.s][1]++; if (ok) scn[q.s][0]++; }
      if (ok) correct++;
      if (at.mode === "exam" && isAnswered(at, pos) && !recorded[pos]) record(q, ok); // exam mode: stats are recorded at submit
    });
    var rec = { ts: Date.now(), label: at.label, kind: at.kind, mode: at.mode, bank: at.bank, total: total, correct: correct, pct: H.pct(correct, total), dom: dom, scn: scn,
      secs: Math.round((Date.now() - at.started) / 1000) };
    H.store.tests.attempts.push(rec);
    H.store.tests.inProgress = null; H.touch(); H.save();
    view.last = { rec: rec, at: at, timedOut: timedOut, used: at.mode === "exam" ? at.items.length * 120 - at.remaining : null };
    screen = "result"; view.render(el, {});
  }

  // ---------- results ----------
  function renderResult(el, res) {
    var r = res.rec, at = res.at, sc = scaled(r.correct / r.total), isBank = r.kind === "bank", pass = isBank && sc >= 720;
    function barColor(p) { return p >= 0.8 ? "var(--ok)" : p >= 0.65 ? "var(--warn)" : "var(--bad)"; }
    function bar(label, c, n) { var p = c / n; return '<div class="x-bar"><label><span>' + esc(label) + '</span><span class="x-muted">' + c + "/" + n + " · " + Math.round(p * 100) + '%</span></label><div class="x-track"><div class="x-fill" style="width:' + p * 100 + "%;background:" + barColor(p) + '"></div></div></div>'; }
    var doms = Object.keys(r.dom).sort().map(function (d) { return bar(d === "0" ? "Uncategorised" : "D" + d + ". " + DOMAINS[d], r.dom[d][0], r.dom[d][1]); }).join("");
    var scs = Object.keys(r.scn).map(function (s) { return bar(scenName(s), r.scn[s][0], r.scn[s][1]); }).join("");
    var wrongPos = at.items.map(function (_, p) { return p; }).filter(function (p) { return !(isAnswered(at, p) && isRight(getQ(at.items[p]), at.ans[p])); });

    el.innerHTML = '<div class="x-wrap"><span class="x-pill"><span class="x-dot"></span>' + esc(r.label) + " · Results</span><h1 class=\"x-h1\">" + (r.pct >= 69 ? "Nice work." : "Keep going.") + "</h1>" +
      (res.timedOut ? '<p class="x-lead">Time expired — your exam was submitted automatically.</p>' : "") +
      '<div class="x-card x-score"><div><div class="x-big">' + r.pct + '%</div><div class="x-muted x-small">' + r.correct + " of " + r.total + ' correct</div></div>' +
      '<div><div style="font-size:28px;font-family:var(--serif)">≈ ' + sc + '</div><div class="x-muted x-small">approx. scaled score</div></div>' +
      "<div>" + (isBank ? '<span class="x-badge ' + (pass ? "ok" : "bad") + ' big">' + (pass ? "At/above 720 target" : "Below 720 target") + "</span>" : '<span class="x-badge">Drill — not a pass estimate</span>') +
      (res.used != null ? '<div class="x-muted x-small" style="margin-top:6px">Time used: ' + fmt(res.used) + "</div>" : "") + "</div></div>" +
      '<div class="x-card" style="margin-top:14px"><h2>By domain</h2><div class="x-bars">' + doms + "</div></div>" +
      (scs ? '<div class="x-card" style="margin-top:14px"><h2>By scenario</h2><div class="x-bars">' + scs + "</div></div>" : "") +
      '<div class="x-row" style="margin:22px 0"><button class="btn primary" id="retake">' + (isBank ? "Retake (reshuffled)" : "Another drill") + "</button>" + (wrongPos.length ? '<button class="btn" id="redo">Drill my misses</button>' : "") +
      '<button class="btn" id="done">All tests</button><span class="x-spacer"></span><div class="x-seg" id="filter"><button data-f="wrong" class="on">Incorrect</button><button data-f="flag">Flagged</button><button data-f="all">All</button></div></div><div id="review"></div></div>';

    function review(f) {
      var items = at.items.map(function (_, p) { return p; }).filter(function (p) {
        var ok = isAnswered(at, p) && isRight(getQ(at.items[p]), at.ans[p]);
        return f === "all" || (f === "wrong" && !ok) || (f === "flag" && at.flags[p]);
      });
      H.$("#review").innerHTML = items.length ? items.map(function (p) {
        var q = getQ(at.items[p]), ans = at.ans[p] || [], ok = isAnswered(at, p) && isRight(q, ans), perm = at.perms[p];
        return '<div class="x-review"><div class="x-qmeta"><span>Q' + (p + 1) + "</span>" + (q.s ? "<span>·</span><span>" + esc(scenName(q.s)) + "</span>" : "") + (q.d ? "<span>·</span><span>D" + q.d + "</span>" : "") +
          ' <span class="x-badge ' + (ok ? "ok" : "bad") + '">' + (ok ? "Correct" : ans.length ? "Incorrect" : "Unanswered") + "</span>" + (at.flags[p] ? ' <span class="x-badge flag">Flagged</span>' : "") + '</div><p class="x-qtext sm">' + esc(q.q) + "</p>" +
          perm.map(function (o, k) {
            var isC = q.a.indexOf(o) >= 0, picked = ans.indexOf(o) >= 0;
            return '<div class="x-mini ' + (isC ? "correct" : picked ? "wrong" : "") + '"><b>' + LET[k] + "</b><span>" + esc(q.o[o]) + (picked ? ' <em class="x-muted">(your answer)</em>' : "") + "</span></div>";
          }).join("") + '<div class="x-explain">' + esc(q.e || "") + "</div></div>";
      }).join("") : '<p class="x-muted">Nothing to show for this filter.</p>';
    }
    H.$$("#filter button").forEach(function (b) { b.onclick = function () { H.$$("#filter button").forEach(function (x) { x.classList.toggle("on", x === b); }); review(b.dataset.f); }; });
    review("wrong");

    el.onclick = function (ev) {
      var t = ev.target.closest("button"); if (!t) return;
      if (t.id === "done") { screen = "home"; view.last = null; view.render(el, {}); }
      else if (t.id === "retake") {
        view.last = null;
        if (isBank) { var b = H.banks.filter(function (x) { return x.id === at.bank; })[0]; startAttempt(b.title, "bank", bankItems(b), at.mode, b.id); }
        else { startAttempt("Mixed drill", "drill", drillItems(0, 15), "study"); }
        screen = "run"; view.render(el, {});
      } else if (t.id === "redo") {
        view.last = null; startAttempt("Retry misses", "drill", wrongPos.map(function (p) { return at.items[p]; }), "study"); screen = "run"; view.render(el, {});
      }
    };
    window.scrollTo({ top: 0 });
  }
})();
