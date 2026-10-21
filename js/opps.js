// Opportunity cards: Davis's collected business ideas with Claude's analysis (data/opps.js), on the Today tab under Jobs Radar.
// Click a card to unveil the philosophy, examples and next steps. Text is escaped; links must be http(s).
(function () {
  "use strict";
  var H = Hub, esc = H.esc;
  function s(x, n) { return String(x == null ? "" : x).slice(0, n || 2000); }
  function list(items, cls) {
    items = Array.isArray(items) ? items : [];
    return items.length ? '<ul class="' + cls + '">' + items.map(function (x) { return "<li>" + esc(s(x, 700)) + "</li>"; }).join("") + "</ul>" : "";
  }
  function block(label, html) { return html ? '<div class="op-blk"><div class="eyebrow">' + label + "</div>" + html + "</div>" : ""; }
  function card(o) {
    if (!o || !o.title) return "";
    var u = H.safeUrl(o.source && o.source.url);
    var ex = (Array.isArray(o.examples) ? o.examples : []).map(function (e) { return e && e.name ? "<li><b>" + esc(s(e.name, 80)) + "</b> — " + esc(s(e.note, 500)) + "</li>" : ""; }).join("");
    return '<details class="op-card" id="op-' + esc(String(o.id || "").replace(/[^\w-]/g, "_")) + '"><summary><span class="op-tag">' + esc(s(o.tag, 40)) + '</span><span class="op-title">' + esc(s(o.title, 140)) + '</span>' +
      (o.tldr ? '<span class="op-tldr">' + esc(s(o.tldr, 300)) + "</span>" : "") + '<span class="op-open small muted">Open ▾</span></summary><div class="op-body">' +
      block("The base philosophy", list(o.philosophy, "op-list")) +
      block("What the source showed", list(o.fromSource, "op-list small")) +
      block("Examples", ex ? '<ul class="op-list">' + ex + "</ul>" : "") +
      block("Implications", list(o.implications, "op-list")) +
      (o.fit ? block("Fit with you", "<p>" + esc(s(o.fit, 600)) + "</p>") : "") +
      block("Next steps", list(o.next, "op-list")) +
      '<p class="small muted op-ev"><b>How solid is this?</b> ' + esc(s(o.evidence, 500)) + (u ? ' <a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(s(o.source.title, 120) || u) + " ↗</a>" : "") + "</p></div></details>";
  }
  H.oppsHtml = function () {
    var all = (window.HUB_OPPS || []).filter(function (o) { return o && o.title; });
    if (!all.length) return "";
    return '<section class="report op-sec"><div class="report-head"><h2>Opportunity cards</h2><span class="small muted">Ideas to evaluate</span></div>' + all.map(card).join("") + "</section>";
  };
})();
