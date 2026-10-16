// Poll: a short questionnaire that tunes the research agents. Answers are kept in localStorage; "Send to agents" opens a
// prefilled GitHub Issue (template poll.yml). A workflow validates it and updates data/profile.js. No backend needed.
(function () {
  "use strict";
  var H = Hub, esc = H.esc;

  function all() { var p = window.HUB_POLL || {}; return (p.core || []).concat(p.adaptive || []); }
  function profileDefault(q) {
    var pr = window.HUB_PROFILE || {};
    if (q.id === "goal") return pr.goal;
    if (q.id === "depth") return pr.depth;
    if (q.id === "minutes") return pr.minutes != null ? String(pr.minutes) : undefined;
    if (q.id === "hype") return pr.hype;
    if (q.id === "topics") return pr.topics;
    if (q.id === "notes") return pr.notes;
    return undefined;
  }
  function answerOf(q) {
    var a = H.store.poll.answers[q.id];
    return a != null ? a : profileDefault(q);
  }
  function payload() {
    var out = {};
    all().forEach(function (q) {
      var a = answerOf(q); if (a == null || (Array.isArray(a) && !a.length)) return;
      out[q.id] = q.type === "text" ? String(a).slice(0, 200) : a;
    });
    return { v: 1, kind: "poll", at: new Date().toISOString(), answers: out };
  }
  function issueUrl() {
    return "https://github.com/" + H.repo + "/issues/new?template=poll.yml&title=" + encodeURIComponent("[hub-poll] Poll answers " + H.today()) +
      "&payload=" + encodeURIComponent(JSON.stringify(payload()));
  }

  function field(q) {
    var a = answerOf(q), h = '<fieldset class="pq"><legend>' + esc(q.text) + "</legend>";
    if (q.type === "text") {
      return h + '<textarea data-pq="' + esc(q.id) + '" maxlength="200" rows="2" placeholder="Optional, e.g. sources to trust or avoid">' + esc(a || "") + "</textarea></fieldset>";
    }
    (q.options || []).forEach(function (o) {
      var on = q.type === "multi" ? Array.isArray(a) && a.indexOf(o.id) >= 0 : String(a) === String(o.id);
      h += '<label class="check"><input type="' + (q.type === "multi" ? "checkbox" : "radio") + '" name="pq-' + esc(q.id) + '" data-pq="' + esc(q.id) + '" data-o="' + esc(o.id) + '"' + (on ? " checked" : "") + "><span>" + esc(o.label) + "</span></label>";
    });
    return h + "</fieldset>";
  }

  H.poll = {
    html: function () {
      var qs = all();
      if (!qs.length) return '<div class="empty small">No poll questions yet.</div>';
      var p = window.HUB_PROFILE || {}, sub = H.store.poll.submittedAt;
      return '<div class="poll"><p class="small muted">Profile in use: <b>' + (p.source === "poll" ? "your poll answers (" + esc(p.updated) + ")" : "starter defaults — answer below to personalize") + "</b>. This repo is public, so keep answers low-sensitivity.</p>" +
        qs.map(field).join("") +
        '<div class="row"><a class="btn primary" id="pollSend" target="_blank" rel="noopener" href="' + esc(issueUrl()) + '">Send to agents</a>' +
        '<span class="small muted">' + (sub ? "Last sent " + H.fmtDate(sub) + ". " : "") + "Opens a prefilled GitHub Issue; press “Submit new issue” there and the agents update within a minute or two.</span></div></div>";
    },
    bind: function (root) {
      root.addEventListener("change", function (ev) {
        var t = ev.target, id = t.dataset && t.dataset.pq; if (!id) return;
        var q = all().filter(function (x) { return x.id === id; })[0]; if (!q) return;
        var ans = H.store.poll.answers;
        if (q.type === "text") ans[id] = t.value;
        else if (q.type === "multi") {
          var cur = Array.isArray(answerOf(q)) ? answerOf(q).slice() : [], i = cur.indexOf(t.dataset.o);
          if (t.checked && i < 0) cur.push(t.dataset.o); else if (!t.checked && i >= 0) cur.splice(i, 1);
          ans[id] = cur;
        } else ans[id] = t.dataset.o;
        H.save(); var a = H.$("#pollSend", root); if (a) a.href = issueUrl();
      });
      root.addEventListener("input", function (ev) {
        var t = ev.target; if (t.tagName === "TEXTAREA" && t.dataset.pq) { H.store.poll.answers[t.dataset.pq] = t.value; H.save(); var a = H.$("#pollSend", root); if (a) a.href = issueUrl(); }
      });
      root.addEventListener("click", function (ev) {
        if (ev.target && ev.target.id === "pollSend") { H.store.poll.submittedAt = Date.now(); H.save(); }
      });
    }
  };
})();
