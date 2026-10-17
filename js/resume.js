// Digital Resume / Log: assembled from everything completed across the app. Printable.
(function () {
  "use strict";
  var H = Hub, esc = H.esc, editing = false;

  function link(url, label) { url = H.safeUrl(url); return url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + "</a>" : ""; }

  function toText(pr, c) {
    var L = [pr.name, pr.headline, [pr.location, pr.email, pr.links].filter(Boolean).join(" · "), "", "SUMMARY", pr.summary, ""];
    if (c.certs.length) { L.push("CERTIFICATIONS"); c.certs.forEach(function (x) { L.push("- " + x.name + " — " + x.issuer + " (" + H.fmtDate(x.ts) + ")"); if (x.detail) L.push("  " + x.detail); }); L.push(""); }
    if (c.projects.length) {
      L.push("PROJECTS");
      c.projects.forEach(function (p) {
        L.push("- " + p.title + ": " + p.desc); if ((p.skills || []).length) L.push("  Skills: " + p.skills.join(", "));
        [["Repo", p.repo], ["Demo", p.demo], ["Write-up", p.writeup]].forEach(function (l) { if (H.safeUrl(l[1])) L.push("  " + l[0] + ": " + l[1]); });
      }); L.push("");
    }
    if (c.skillList.length) L.push("SKILLS", c.skillList.join(", "), "");
    if (c.highlights.length) { L.push("HIGHLIGHTS"); c.highlights.forEach(function (h) { L.push("- " + h.text); }); L.push(""); }
    if (pr.experience.trim()) L.push("BACKGROUND", pr.experience.trim());
    return L.join("\n");
  }

  H.views.resume = {
    render: function (el) {
      var pr = H.store.profile, c = H.collect();
      var contact = [pr.location, pr.email].filter(Boolean).map(esc).concat(pr.links.split(/[\s,]+/).filter(Boolean).map(function (u) { return H.safeUrl(u) ? link(u, u.replace(/^https?:\/\//, "")) : esc(u); }));
      var doc = '<article class="resume"><header><h1>' + esc(pr.name || "Your name") + "</h1><div class=\"headline\">" + esc(pr.headline) + '</div><div class="contact">' + (contact.join(" · ") || '<span class="noprint muted">Add location / email / links via Edit details</span>') + "</div></header>" +
        (pr.summary ? "<section><h2>Summary</h2><p>" + esc(pr.summary) + "</p></section>" : "") +
        (c.certs.length ? "<section><h2>Certifications</h2><ul>" + c.certs.map(function (x) { return "<li><b>" + esc(x.name) + "</b> — " + esc(x.issuer) + ' <span class="when">' + H.fmtDate(x.ts) + "</span>" + (x.detail ? '<div class="small muted">' + esc(x.detail) + "</div>" : "") + "</li>"; }).join("") + "</ul></section>" : "") +
        (c.projects.length ? "<section><h2>Projects</h2>" + c.projects.map(function (p) {
          return '<div class="rp"><div><b>' + esc(p.title) + "</b> " + [link(p.repo, "repo"), link(p.demo, "demo"), link(p.writeup, "write-up")].filter(Boolean).join(" · ") + "</div><p>" + esc(p.desc) + "</p>" +
            ((p.skills || []).length ? '<div class="small muted">' + esc(p.skills.join(" · ")) + "</div>" : "") + "</div>";
        }).join("") + "</section>" : "") +
        (c.skillList.length ? '<section><h2>Skills</h2><div class="tags">' + c.skillList.map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join("") + "</div></section>" : "") +
        (c.highlights.length ? "<section><h2>Highlights</h2><ul>" + c.highlights.map(function (h) { return "<li>" + esc(h.text) + "</li>"; }).join("") + "</ul></section>" : "") +
        (pr.experience.trim() ? "<section><h2>Background</h2><p>" + esc(pr.experience).replace(/\n/g, "<br>") + "</p></section>" : '<section class="noprint"><h2>Background</h2><p class="muted">Add your fitness experience under Edit details — reframe it for AI work (clients coached, programs designed, systems you ran).</p></section>') +
        (!c.certs.length && !c.projects.length && !c.skillList.length ? '<section class="noprint"><p class="muted">This resume fills itself in with your big wins only: certifications (like the CAF), shipped projects and landmark milestones. Routine tasks stay in the activity log. Nothing is claimed until you complete it.</p></section>' : "") + "</article>";

      var inprog = c.pending.length ? '<div class="card noprint"><div class="eyebrow">Not on the resume yet</div><ul class="small muted">' + c.pending.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>" : "";
      var log = c.log.length ? '<div class="card noprint"><div class="eyebrow">Activity log</div><ul class="log">' + c.log.slice(0, 40).map(function (l) {
        return "<li><span class=\"small muted\">" + (l.ts ? H.fmtDate(l.ts) : "—") + "</span> " + esc(l.title) + ' <span class="small muted">· ' + esc(l.source) + "</span></li>";
      }).join("") + "</ul></div>" : "";
      var edit = editing ? '<form class="card noprint pform" id="pf"><div class="eyebrow">Edit details</div>' +
        ["name", "headline", "location", "email", "links"].map(function (k) { return "<label>" + k[0].toUpperCase() + k.slice(1) + (k === "links" ? " (space-separated URLs)" : "") + '<input name="' + k + '" value="' + esc(pr[k]) + '"></label>'; }).join("") +
        '<label>Summary<textarea name="summary" rows="3">' + esc(pr.summary) + '</textarea></label><label>Background / experience (shown as written)<textarea name="experience" rows="5">' + esc(pr.experience) + '</textarea></label>' +
        '<div class="row"><button class="btn primary small" type="submit">Save</button><button class="btn ghost small" type="button" id="cancel">Cancel</button></div></form>' : "";

      el.innerHTML = '<div class="page"><div class="noprint"><h1>Digital Resume</h1><p class="lead">Built automatically from what you’ve actually completed. By March 2027 this should read like a real resume.</p>' +
        '<div class="row"><button class="btn primary" id="print">Print / save as PDF</button><button class="btn" id="copy">Copy as text</button><button class="btn" id="edit">Edit details</button></div></div>' + edit + doc + inprog + log + "</div>";

      el.onclick = function (ev) {
        var id = ev.target.id;
        if (id === "print") window.print();
        else if (id === "edit") { editing = true; H.views.resume.render(el); }
        else if (id === "cancel") { editing = false; H.views.resume.render(el); }
        else if (id === "copy") {
          var txt = toText(pr, c), b = ev.target;
          (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { b.textContent = "Copied ✓"; }, function () {
            var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); b.textContent = "Copied ✓"; } catch (e) { b.textContent = "Copy failed"; } ta.remove();
          });
        }
      };
      el.onsubmit = function (ev) {
        ev.preventDefault();
        var f = ev.target.elements;
        ["name", "headline", "location", "email", "links", "summary", "experience"].forEach(function (k) { pr[k] = f[k].value.trim(); });
        editing = false; H.save(); H.views.resume.render(el);
      };
    }
  };
})();
