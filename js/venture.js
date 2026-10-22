// Venture: the startup idea the Business section is built around (seed: data/venture.js). Edits are saved per section in the
// browser (store.venture) and win over the seed; Reset restores the seed text. All text is escaped.
(function () {
  "use strict";
  var H = Hub, esc = H.esc;
  function seed() { return H.data.venture || null; }
  function saved(id, def) { var v = H.store.venture && H.store.venture[id]; return typeof v === "string" ? v : def; }
  function body(text) {
    var out = "", list = [];
    function flush() { if (list.length) { out += "<ul>" + list.join("") + "</ul>"; list = []; } }
    String(text || "").split(/\n\s*\n/).forEach(function (blk) {
      blk.split("\n").forEach(function (ln) {
        var m = /^\s*-\s+(.*)$/.exec(ln);
        if (m) list.push("<li>" + esc(m[1]) + "</li>"); else if (ln.trim()) { flush(); out += "<p>" + esc(ln.trim()) + "</p>"; }
      });
      flush();
    });
    return out;
  }
  function sec(s) {
    var txt = saved(s.id, s.body), edited = txt !== s.body;
    return '<details class="vn" data-vn="' + esc(s.id) + '"' + (s.id === "thesis" ? " open" : "") + "><summary><b>" + esc(s.title) + "</b>" +
      (edited ? ' <span class="small muted">edited</span>' : "") + '</summary><div class="vn-body">' + body(txt) +
      '<p class="vn-act"><button class="btn small ghost" data-vn-edit="' + esc(s.id) + '">Edit</button></p></div></details>';
  }
  H.ventureShell = function () {
    var v = seed(); if (!v) return "";
    return '<section class="report bm-sec" id="venture"><div class="report-head"><h2>The venture</h2><span class="small muted">' + esc(v.status) + "</span></div>" +
      '<p class="lead"><b>' + esc(v.name) + ".</b> " + esc(v.oneLiner) + "</p>" + v.sections.map(sec).join("") + "</section>";
  };
  H.mountVenture = function (root) {
    var el = H.$("#venture", root); if (!el) return;
    el.addEventListener("click", function (ev) {
      var t = ev.target, id = t.dataset && t.dataset.vnEdit, sd = seed(), s;
      if (id && sd) {
        s = sd.sections.filter(function (x) { return x.id === id; })[0]; if (!s) return;
        var box = t.closest(".vn-body");
        box.innerHTML = '<textarea rows="12" data-vn-text>' + esc(saved(id, s.body)) + '</textarea><p class="small muted">Blank line = new paragraph; "- " starts a bullet.</p>' +
          '<p class="vn-act"><button class="btn small primary" data-vn-save="' + esc(id) + '">Save</button> <button class="btn small ghost" data-vn-cancel>Cancel</button> ' +
          '<button class="btn small ghost" data-vn-reset="' + esc(id) + '">Reset to draft</button></p>';
        return;
      }
      var act = t.dataset && (t.dataset.vnSave || t.dataset.vnReset || ("vnCancel" in t.dataset ? "cancel" : null));
      if (!act) return;
      var d = t.closest("details"), key = d.dataset.vn;
      if (t.dataset.vnSave) { H.store.venture = H.store.venture || {}; H.store.venture[key] = H.$("[data-vn-text]", d).value; H.save(); }
      else if (t.dataset.vnReset && H.store.venture) { delete H.store.venture[key]; H.save(); }
      var wrap = document.createElement("div"); wrap.innerHTML = sec(seed().sections.filter(function (x) { return x.id === key; })[0]);
      var n = wrap.firstChild; n.open = true; d.parentNode.replaceChild(n, d);
    });
  };
})();
