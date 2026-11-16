// CCAR-P practice exams. Plain script, no build step.
// Question data lives in data/*.json (listed in data/exams.json); this file is only the UI.
// All progress is held in memory: nothing is written to localStorage, cookies or any server,
// so reloading or closing the tab ends the attempt.
(function () {
  "use strict";

  var DOMAINS = {
    1: "Solution Design & Architecture",
    2: "Claude Models, Prompting & Context Engineering",
    3: "Integration",
    4: "Evaluation, Testing & Optimization",
    5: "Governance, Safety & Risk Management",
    6: "Stakeholder Communication & Lifecycle Management",
    7: "Developer Productivity & Operational Enablement"
  };
  var LETTERS = "ABCDEFGH";
  var WORDS = { 1: "ONE", 2: "TWO", 3: "THREE", 4: "FOUR", 5: "FIVE", 6: "SIX" };
  var EXAM_MINUTES = 120;

  var app = document.getElementById("app");
  var exams = [];          // loaded exam files
  var timerOn = true;      // home-screen setting
  var run = null;          // the attempt in progress (in memory only)
  var tick = null;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function need(q) { return q.correct.length; }
  function isRight(q, picked) {
    if (!picked || picked.length !== q.correct.length) return false;
    return q.correct.every(function (k) { return picked.indexOf(k) >= 0; });
  }
  function fmt(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0"); }

  // ---------------- loading ----------------
  function setExams(list) {
    exams = list.filter(function (d) { return d.kind !== "draft"; }).sort(function (a, b) { return (a.kind === "sample") - (b.kind === "sample") || a.exam - b.exam; });
  }

  // Hosted mode: <html data-bundle="bundle.enc.json"> means the questions ship only as an AES-256-GCM ciphertext.
  // The key is derived in the browser from the password with PBKDF2-SHA-256; nothing is stored or sent anywhere.
  function b64(s) { var bin = atob(s), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
  function unlock(bundleUrl) {
    app.innerHTML = '<div class="x-wrap"><a class="x-muted x-small" href="../#/tests">← Dev Hub</a><br><span class="x-pill"><span class="x-dot"></span>CCAR-P · Private practice exams</span><h1 class="x-h1">Locked</h1>' +
      '<p class="x-lead">The questions are encrypted. Enter the password to decrypt them in this tab. Nothing is saved; reloading the page locks it again.</p>' +
      '<form id="unlockForm" class="x-row" autocomplete="off"><input id="pw" type="password" autocomplete="off" spellcheck="false" aria-label="Password" ' +
      'style="font:inherit;padding:9px 12px;border:1px solid var(--line);border-radius:2px;background:var(--panel);color:var(--text);min-width:260px;flex:1;max-width:420px">' +
      '<button class="btn primary" type="submit" id="unlockBtn">Unlock</button></form><p class="x-instr" id="unlockMsg" style="margin-top:12px"></p></div>';
    var form = byId("unlockForm"), pw = byId("pw"), msg = byId("unlockMsg"), btn = byId("unlockBtn");
    pw.focus();
    form.onsubmit = function (e) {
      e.preventDefault();
      var pass = pw.value; pw.value = ""; btn.disabled = true; msg.textContent = "Decrypting…"; msg.classList.remove("warn");
      fetch(bundleUrl, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error("bundle " + r.status); return r.json(); }).then(function (b) {
        var enc = new TextEncoder();
        return crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]).then(function (base) {
          return crypto.subtle.deriveKey({ name: "PBKDF2", salt: b64(b.salt), iterations: b.iterations, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
        }).then(function (key) {
          return crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(b.iv), additionalData: enc.encode(b.aad) }, key, b64(b.ciphertext));
        }).then(function (plain) {
          var stream = new Blob([plain]).stream().pipeThrough(new DecompressionStream("gzip"));
          return new Response(stream).json();
        });
      }).then(function (data) {
        pass = null; setExams(data.exams); home("replace");
      }).catch(function (err) {
        pass = null; btn.disabled = false; msg.classList.add("warn");
        msg.textContent = err && err.name === "OperationError" ? "Wrong password." : "Could not unlock: " + (err && err.message || err);
        pw.focus();
      });
    };
  }

  function load() {
    var bundleUrl = document.documentElement.getAttribute("data-bundle");
    if (bundleUrl) return unlock(bundleUrl);
    if (location.protocol === "file:") {
      app.innerHTML = '<div class="x-wrap"><h1 class="x-h1">Start the local server</h1><p class="x-lead">The exam data loads over HTTP. In this folder run <code>python3 -m http.server 8010</code>, then open <a href="http://localhost:8010/">http://localhost:8010/</a>.</p></div>';
      return;
    }
    fetch("data/exams.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (m) {
      return Promise.all(m.exams.map(function (e) {
        return fetch("data/" + e.file, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) { d.kind = e.kind; d.file = e.file; return d; });
      }));
    }).then(function (list) {
      setExams(list);
      home("replace");
    }).catch(function (err) {
      app.innerHTML = '<div class="x-wrap"><h1 class="x-h1">Could not load the exams</h1><p class="x-lead">' + esc(err.message) + "</p></div>";
    });
  }

  // ---------------- home ----------------
  // Each screen is a browser-history entry, so Back steps through the exam instead of leaving the page.
  function nav(st, replace) {
    var url = "#" + st.s + (st.i != null ? "-" + (st.i + 1) : "");
    try { history[replace ? "replaceState" : "pushState"](st, "", url); } catch (e) { /* file:// */ }
  }
  var hosted = !!document.documentElement.getAttribute("data-bundle");
  function hubLink() { return hosted ? '<a class="x-muted x-small" href="../#/tests">← Dev Hub</a><br>' : ""; }

  function home(fromPop) {
    stopTimer(); run = null; window.scrollTo(0, 0);
    if (fromPop !== true) nav({ s: "home" }, fromPop === "replace");
    var cards = exams.map(function (ex, i) {
      var doms = {}; ex.questions.forEach(function (q) { doms[q.domain] = (doms[q.domain] || 0) + 1; });
      var tags = Object.keys(doms).sort().map(function (d) { return '<span class="x-tag">D' + d + " · " + doms[d] + "</span>"; }).join("");
      return '<div class="x-card x-test"><div><h2>' + esc(ex.title) + '</h2><div class="x-muted x-small">' + esc(ex.subtitle || "") + '</div><div class="x-tags"><span class="x-tag">' + ex.questions.length + " questions</span>" + tags + "</div></div>" +
        '<button class="btn primary" data-start="' + i + '">Start</button></div>';
    }).join("");
    app.innerHTML = '<div class="x-wrap">' + hubLink() + '<span class="x-pill"><span class="x-dot"></span>CCAR-P · Unofficial practice · Private</span>' +
      '<h1 class="x-h1">Practice exams</h1>' +
      '<p class="x-lead">Modeled on the Claude Certified Architect – Professional exam: 63 standalone items, multiple choice and multiple response, 120 minutes.</p>' +
      '<div class="x-row" style="margin-bottom:6px"><span class="x-muted x-small">Mode</span><div class="x-seg" id="timerSeg"><button data-t="1" class="' + (timerOn ? "on" : "") + '">Exam · 120 min</button><button data-t="0" class="' + (timerOn ? "" : "on") + '">Practice · no timer</button></div></div>' +
      '<p class="x-muted x-small" style="margin:0 0 18px">' + (timerOn ? "Exam mode: timed, and answers are revealed only in the review after you submit." : "Practice mode: no timer, and each answer is checked as soon as you choose it, with the rationale.") + "</p>" +
      '<div class="x-cards">' + (cards || '<div class="x-card">No exams in data/exams.json yet.</div>') + "</div>" +
      '<div class="x-note">Scoring here is all-or-nothing per item and reported as percent correct. The real exam reports a <b>scaled score from 100 to 1,000 with a pass mark of 720</b>, so the percent shown here is only a rough estimate of readiness.</div>' +
      '<p class="x-muted x-small">Progress is kept in memory only. Reloading or closing this tab ends the attempt.</p></div>';
    app.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { timerOn = b.getAttribute("data-t") === "1"; home("replace"); }; });
    app.querySelectorAll("[data-start]").forEach(function (b) { b.onclick = function () { start(exams[+b.getAttribute("data-start")]); }; });
  }

  // ---------------- running an exam ----------------
  function start(ex) {
    paused = null;
    run = { ex: ex, i: 0, picks: ex.questions.map(function () { return []; }), flags: ex.questions.map(function () { return false; }),
      started: Date.now(), limit: timerOn ? EXAM_MINUTES * 60 : 0, done: false, gridOpen: false, hint: "",
      practice: !timerOn, revealed: ex.questions.map(function () { return false; }) };
    if (run.limit) startTimer();
    nav({ s: "q", i: 0 });
    question();
  }
  function startTimer() {
    stopTimer();
    tick = setInterval(function () {
      var left = run.limit - (Date.now() - run.started) / 1000, el = document.getElementById("timer");
      if (left <= 0) { stopTimer(); submit(true); return; }
      if (el) { el.textContent = fmt(left); el.classList.toggle("low", left < 600); }
    }, 1000);
  }
  function stopTimer() { if (tick) clearInterval(tick); tick = null; }

  function question() {
    var ex = run.ex, q = ex.questions[run.i], n = ex.questions.length, picked = run.picks[run.i], k = need(q);
    var answered = run.picks.filter(function (p) { return p.length; }).length;
    var left = run.limit ? run.limit - (Date.now() - run.started) / 1000 : 0;
    var shown = run.practice && run.revealed[run.i];
    var opts = q.options.map(function (o, j) {
      var on = picked.indexOf(j) >= 0;
      if (shown) {
        var isC = q.correct.indexOf(j) >= 0;
        return '<div class="x-opt' + (isC ? " correct" : on ? " wrong" : "") + '" aria-disabled="true"><span class="x-key">' + LETTERS[j] + '</span><span class="x-txt">' + esc(o) + (on ? '<span class="x-yours">your answer</span>' : "") + "</span></div>";
      }
      return '<button class="x-opt' + (on ? " sel" : "") + '" data-o="' + j + '" role="' + (k > 1 ? "checkbox" : "radio") + '" aria-checked="' + on + '"><span class="x-key">' + LETTERS[j] + '</span><span class="x-txt">' + esc(o) + "</span></button>";
    }).join("");
    var ok = shown && isRight(q, picked);
    var feedback = shown ? '<div class="x-explain"><div class="x-verdict ' + (ok ? "ok" : "bad") + '">' + (ok ? "Correct" : "Incorrect · correct answer: " + q.correct.map(function (c) { return LETTERS[c]; }).join(", ")) + "</div>" + esc(q.rationale) + "</div>" : "";
    var tally = "";
    if (run.practice) {
      var seen = 0, good = 0; run.revealed.forEach(function (r, j) { if (r) { seen++; if (isRight(ex.questions[j], run.picks[j])) good++; } });
      tally = '<span class="x-timer">' + good + " / " + seen + " correct</span>";
    }
    var grid = run.gridOpen ? '<div class="x-card" style="margin-top:22px"><div class="x-row between"><b>All questions</b><span class="x-muted x-small">' + answered + " of " + n + " answered · " + run.flags.filter(Boolean).length + ' flagged</span></div><div class="x-grid">' +
      ex.questions.map(function (qq, j) {
        var st = run.practice && run.revealed[j] ? (isRight(qq, run.picks[j]) ? " r-ok" : " r-bad") : (run.picks[j].length ? " ans" : "");
        return '<button class="x-cell' + st + (run.flags[j] ? " flag" : "") + (j === run.i ? " cur" : "") + '" data-go="' + j + '">' + (j + 1) + "</button>"; }).join("") +
      '</div><div class="x-legend"><span style="--sw:var(--panel2)">Answered</span><span style="--sw:#fff">Unanswered</span><span style="--sw:var(--warn)">Flagged</span></div></div>' : "";
    app.innerHTML =
      '<div class="x-topbar"><div class="x-inner"><b class="x-small">' + esc(ex.title) + '</b><span class="x-muted x-small">Question ' + (run.i + 1) + " of " + n + "</span><span class=\"x-spacer\"></span>" +
      (run.limit ? '<span class="x-timer' + (left < 600 ? " low" : "") + '" id="timer">' + fmt(left) + "</span>" : tally) +
      '<button class="btn small ghost" id="gridBtn">' + (run.gridOpen ? "Hide grid" : "Question grid") + '</button><button class="btn small" id="submitBtn">' + (run.practice ? "End practice" : "Submit exam") + "</button></div>" +
      '<div class="x-inner x-thin"><div class="x-progress"><div style="width:' + (answered / n * 100) + '%"></div></div></div></div>' +
      '<div class="x-wrap"><div class="x-qtext">' + esc(q.stem) + "</div>" +
      '<p class="x-instr' + (run.hint ? " warn" : "") + '">' + (run.hint || (k > 1 ? "Select " + (WORDS[k] || k) + " · " + picked.length + " of " + k + " selected" : "Select ONE")) + "</p>" +
      '<div class="x-opts">' + opts + "</div>" + feedback +
      '<div class="x-navrow"><button class="btn" id="prevBtn"' + (run.i ? "" : " disabled") + '>← Previous</button>' +
      '<button class="btn x-flagbtn' + (run.flags[run.i] ? " on" : "") + '" id="flagBtn">' + (run.flags[run.i] ? "⚑ Flagged" : "⚐ Flag for review") + "</button>" +
      (run.i < n - 1 ? '<button class="btn primary" id="nextBtn">Next →</button>' : '<button class="btn primary" id="endBtn">Finish</button>') + "</div>" +
      grid + '<p class="x-kbd"><kbd>A</kbd>–<kbd>' + LETTERS[q.options.length - 1] + "</kbd> choose · <kbd>←</kbd> <kbd>→</kbd> move · <kbd>F</kbd> flag</p></div>";
    run.hint = "";

    app.querySelectorAll("[data-o]").forEach(function (b) { b.onclick = function () { choose(+b.getAttribute("data-o")); }; });
    app.querySelectorAll("[data-go]").forEach(function (b) { b.onclick = function () { go(+b.getAttribute("data-go")); }; });
    byId("prevBtn").onclick = function () { go(run.i - 1); };
    byId("flagBtn").onclick = toggleFlag;
    byId("gridBtn").onclick = function () { run.gridOpen = !run.gridOpen; question(); };
    byId("submitBtn").onclick = confirmSubmit;
    if (byId("nextBtn")) byId("nextBtn").onclick = function () { go(run.i + 1); };
    if (byId("endBtn")) byId("endBtn").onclick = confirmSubmit;
  }
  function byId(id) { return document.getElementById(id); }
  function go(j, fromPop) { if (!run || j < 0 || j >= run.ex.questions.length) return; run.i = j; if (!fromPop) nav({ s: "q", i: j }); question(); window.scrollTo(0, 0); }
  function toggleFlag() { run.flags[run.i] = !run.flags[run.i]; question(); }
  function choose(j) {
    var q = run.ex.questions[run.i], p = run.picks[run.i], k = need(q), at = p.indexOf(j);
    if (j >= q.options.length || (run.practice && run.revealed[run.i])) return;
    if (k === 1) run.picks[run.i] = at >= 0 ? [] : [j];
    else if (at >= 0) p.splice(at, 1);
    else if (p.length < k) p.push(j);
    else run.hint = "You can select only " + (WORDS[k] || k) + ". Clear one choice first.";
    if (run.practice && run.picks[run.i].length === k) run.revealed[run.i] = true;   // practice: check as soon as the answer is complete
    question();
  }

  function confirmSubmit() {
    var un = run.picks.filter(function (p, j) { return p.length !== need(run.ex.questions[j]); }).length, fl = run.flags.filter(Boolean).length;
    var bg = document.createElement("div"); bg.className = "x-modal-bg";
    bg.innerHTML = '<div class="x-modal" role="dialog" aria-modal="true"><h2>' + (run.practice ? "End this practice session?" : "Submit the exam?") + "</h2><p>" +
      (un ? un + " question" + (un > 1 ? "s are" : " is") + " unanswered or incomplete (scored as wrong). " : "Every question is answered. ") +
      (fl ? fl + " flagged for review." : "") + '</p><div class="x-row"><button class="btn primary" id="yesBtn">Submit</button><button class="btn ghost" id="noBtn">Keep working</button></div></div>';
    document.body.appendChild(bg);
    byId("noBtn").onclick = function () { bg.remove(); };
    byId("yesBtn").onclick = function () { bg.remove(); submit(false); };
  }

  // ---------------- results ----------------
  function submit(timedOut) {
    stopTimer();
    run.done = true; run.timedOut = timedOut; run.used = (Date.now() - run.started) / 1000;
    nav({ s: "results" });
    results(true);
  }
  function results(fromPop) {
    if (fromPop !== true) nav({ s: "results" });
    window.scrollTo(0, 0);
    var qs = run.ex.questions, right = 0, by = {};
    qs.forEach(function (q, j) {
      var ok = isRight(q, run.picks[j]); if (ok) right++;
      by[q.domain] = by[q.domain] || { n: 0, ok: 0 }; by[q.domain].n++; if (ok) by[q.domain].ok++;
    });
    var pct = Math.round(right / qs.length * 100);
    var doms = Object.keys(by).sort().map(function (d) {
      var p = Math.round(by[d].ok / by[d].n * 100), col = p >= 72 ? "var(--ok)" : p >= 60 ? "var(--warn)" : "var(--bad)";
      return '<div class="x-dom"><div class="x-dom-top"><span class="x-dom-name">Domain ' + d + ": " + esc(DOMAINS[d]) + '</span><span class="x-muted">' + by[d].ok + " / " + by[d].n + " · <b>" + p + '%</b></span></div><div class="x-bar-row"><div class="x-track"><div class="x-fill" style="width:' + p + "%;background:" + col + '"></div></div></div></div>';
    }).join("");
    app.innerHTML = '<div class="x-wrap"><span class="x-pill"><span class="x-dot"></span>' + (run.practice ? "Practice results · " : "Score report · ") + esc(run.ex.title) + "</span>" +
      (run.timedOut ? '<p class="x-instr warn">Time expired, so the exam was submitted automatically.</p>' : "") +
      '<div class="x-card" style="margin-top:14px"><div class="x-score"><div class="x-big">' + pct + '%</div><div><div><b>' + right + " of " + qs.length + "</b> correct</div>" +
      '<div class="x-muted x-small">Time used ' + fmt(run.used) + (run.limit ? " of " + fmt(run.limit) : "") + " · " + run.flags.filter(Boolean).length + " flagged</div></div></div>" +
      '<div class="x-note">The real exam is pass/fail on a <b>scaled score of 100–1,000, with 720 to pass</b>. Scaled scores are not a straight percentage, so treat this percent as a rough estimate only.</div>' +
      "<h2>Percent correct by domain</h2>" + doms + "</div>" +
      '<div class="x-navrow"><button class="btn primary" data-rv="all">Review all answers</button><button class="btn" data-rv="wrong">Review incorrect</button><button class="btn" data-rv="flag">Review flagged</button>' +
      '<button class="btn ghost" id="againBtn">Retake</button><button class="btn ghost" id="homeBtn">All exams</button></div></div>';
    app.querySelectorAll("[data-rv]").forEach(function (b) { b.onclick = function () { review(b.getAttribute("data-rv")); }; });
    byId("againBtn").onclick = function () { start(run.ex); };
    byId("homeBtn").onclick = function () { home(); };
  }

  function review(filter, fromPop) {
    if (fromPop !== true) nav({ s: "review", f: filter });
    window.scrollTo(0, 0);
    var qs = run.ex.questions;
    var items = qs.map(function (q, j) {
      var p = run.picks[j], ok = isRight(q, p);
      if (filter === "wrong" && ok) return "";
      if (filter === "flag" && !run.flags[j]) return "";
      var opts = q.options.map(function (o, k) {
        var isC = q.correct.indexOf(k) >= 0, isP = p.indexOf(k) >= 0;
        var cls = isC ? " correct" : isP ? " wrong" : "";
        return '<div class="x-opt' + cls + '" aria-disabled="true"><span class="x-key">' + LETTERS[k] + '</span><span class="x-txt">' + esc(o) + (isP ? '<span class="x-yours">your answer</span>' : "") + "</span></div>";
      }).join("");
      var src = q.source === "course-quiz" ? "Course quiz" : q.source === "course-quiz-adapted" ? "Adapted from course exercise" : "Original";
      return '<div class="x-review"><div class="x-qmeta"><b>Question ' + (j + 1) + '</b><span class="x-badge ' + (ok ? "ok" : "bad") + '">' + (ok ? "Correct" : p.length ? "Incorrect" : "Unanswered") + "</span>" +
        (run.flags[j] ? '<span class="x-badge flag">Flagged</span>' : "") + "<span>Domain " + q.domain + ": " + esc(DOMAINS[q.domain]) + '</span></div><div class="x-qtext sm">' + esc(q.stem) + '</div><div class="x-opts">' + opts + "</div>" +
        '<div class="x-explain"><div class="x-verdict ' + (ok ? "ok" : "bad") + '">Correct answer: ' + q.correct.map(function (k) { return LETTERS[k]; }).join(", ") + "</div>" + esc(q.rationale) +
        '<div class="x-src" style="margin-top:8px">' + src + (q.objective ? " · " + esc(q.objective) : "") + "</div></div></div>";
    }).join("");
    app.innerHTML = '<div class="x-wrap"><span class="x-pill"><span class="x-dot"></span>Answer review · ' + esc(run.ex.title) + "</span>" +
      '<div class="x-filter x-seg"><button data-rv="all" class="' + (filter === "all" ? "on" : "") + '">All</button><button data-rv="wrong" class="' + (filter === "wrong" ? "on" : "") + '">Incorrect</button><button data-rv="flag" class="' + (filter === "flag" ? "on" : "") + '">Flagged</button></div>' +
      (items || '<p class="x-muted" style="margin-top:20px">Nothing to show for this filter.</p>') +
      '<div class="x-navrow"><button class="btn primary" id="backBtn">Back to score report</button><button class="btn ghost" id="homeBtn">All exams</button></div></div>';
    app.querySelectorAll("[data-rv]").forEach(function (b) { b.onclick = function () { review(b.getAttribute("data-rv")); }; });
    byId("backBtn").onclick = function () { results(); };
    byId("homeBtn").onclick = function () { home(); };
  }

  // Back / Forward: move between screens of the current attempt.
  window.addEventListener("popstate", function (e) {
    var st = e.state;
    if (!st || !exams.length) return;
    var m = document.querySelector(".x-modal-bg"); if (m) m.remove();
    if (st.s === "q" && run && !run.done) return go(st.i, true);
    if (st.s === "results" && run && run.done) return results(true);
    if (st.s === "review" && run && run.done) return review(st.f || "all", true);
    if (st.s === "q" && run && run.done) return results(true);
    if (st.s === "q" && !run && paused && st.i < paused.ex.questions.length) { run = paused; paused = null; if (run.limit) startTimer(); return go(st.i, true); }
    if (run && !run.done) paused = run;   // Back past question 1: keep the attempt so Forward can resume it
    home(true);
  });
  var paused = null;

  // ---------------- keyboard ----------------
  document.addEventListener("keydown", function (e) {
    if (!run || run.done || document.querySelector(".x-modal-bg") || e.metaKey || e.ctrlKey || e.altKey) return;
    var key = e.key.toUpperCase(), q = run.ex.questions[run.i];
    var idx = LETTERS.indexOf(key); if (idx < 0 && /^[1-8]$/.test(key)) idx = +key - 1;
    if (idx >= 0 && idx < q.options.length && key.length === 1) { e.preventDefault(); choose(idx); }
    else if (e.key === "ArrowRight") go(run.i + 1);
    else if (e.key === "ArrowLeft") go(run.i - 1);
    else if (key === "F") toggleFlag();
  });

  load();
})();
