// Projects: pipeline (idea → building → shipped) + portfolio page. Add projects freely in the UI.
(function () {
  "use strict";
  var H = Hub, esc = H.esc, tab = "pipeline", editing = null, adding = false, armedDelete = null;
  var STATUS = ["idea", "building", "shipped"];

  function link(label, url) { url = H.safeUrl(url); return url ? '<a class="ext" href="' + esc(url) + '" target="_blank" rel="noopener">' + label + " ↗</a>" : ""; }
  function find(id) { return H.store.projects.filter(function (p) { return p.id === id; })[0]; }
  function chips(p) { return (p.skills || []).map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join(""); }

  function form(p, isNew) {
    return '<form class="pform" data-id="' + esc(p.id) + '"><label>Title<input name="title" value="' + esc(p.title) + '" required></label>' +
      '<label>Description<textarea name="desc" rows="2">' + esc(p.desc) + "</textarea></label>" +
      '<label>Skills it demonstrates (comma-separated)<input name="skills" value="' + esc((p.skills || []).join(", ")) + '"></label>' +
      '<div class="grid three"><label>Repo link<input name="repo" value="' + esc(p.repo) + '" placeholder="https://github.com/…"></label>' +
      '<label>Demo link<input name="demo" value="' + esc(p.demo) + '" placeholder="https://…"></label>' +
      '<label>Write-up link<input name="writeup" value="' + esc(p.writeup) + '" placeholder="https://…"></label></div>' +
      '<label>Notes<textarea name="note" rows="2">' + esc(p.note || "") + "</textarea></label>" +
      '<div class="row"><button class="btn primary small" type="submit">' + (isNew ? "Add project" : "Save") + '</button><button class="btn ghost small" type="button" data-act="cancel">Cancel</button></div></form>';
  }

  function card(p) {
    if (editing === p.id) return '<div class="card">' + form(p, false) + "</div>";
    var seg = STATUS.map(function (s) { return '<button class="' + (p.status === s ? "on" : "") + '" data-act="status" data-id="' + esc(p.id) + '" data-s="' + s + '">' + s + "</button>"; }).join("");
    var links = [link("Repo", p.repo), link("Demo", p.demo), link("Write-up", p.writeup)].filter(Boolean).join(" · ");
    return '<div class="card proj ' + p.status + '"><div class="proj-top"><h3>' + esc(p.title) + '</h3><div class="seg">' + seg + "</div></div><p>" + esc(p.desc) + '</p><div class="tags">' + chips(p) + "</div>" +
      (links ? '<div class="small links">' + links + "</div>" : '<div class="small muted">No links yet — add repo / demo / write-up when you have them.</div>') +
      (p.note ? '<div class="small muted note">' + esc(p.note) + "</div>" : "") +
      (p.status === "shipped" && p.shippedAt ? '<div class="small okc">Shipped ' + H.fmtDate(p.shippedAt) + "</div>" : "") +
      '<div class="row"><button class="btn small" data-act="edit" data-id="' + esc(p.id) + '">Edit</button><button class="btn ghost small" data-act="del" data-id="' + esc(p.id) + '">' + (armedDelete === p.id ? "Click again to delete" : "Delete") + "</button></div></div>";
  }

  function portfolio() {
    var s = H.store.projects.filter(function (p) { return p.status === "shipped"; });
    if (!s.length) return '<div class="card empty">Nothing shipped yet. Ship your first project and it shows up here with its links and write-up.</div>';
    return '<div class="card portfolio"><h2 class="tight">' + esc(H.store.profile.name) + " — Portfolio</h2><div class=\"muted\">" + esc(H.store.profile.headline) + "</div>" +
      s.map(function (p) {
        return '<div class="pf-item"><h3>' + esc(p.title) + "</h3><p>" + esc(p.desc) + '</p><div class="tags">' + chips(p) + '</div><div class="small links">' +
          [link("Repo", p.repo), link("Demo", p.demo), link("Write-up", p.writeup)].filter(Boolean).join(" · ") + "</div></div>";
      }).join("") + '</div><div class="row noprint"><button class="btn" onclick="window.print()">Print / save as PDF</button></div>';
  }

  H.views.projects = {
    render: function (el) {
      var list = H.store.projects;
      var shipped = list.filter(function (p) { return p.status === "shipped"; }).length;
      var newP = { id: "p-" + Date.now().toString(36), title: "", desc: "", skills: [], status: "idea", repo: "", demo: "", writeup: "", note: "" };
      el.innerHTML = '<div class="page"><h1>Projects</h1><p class="lead">Proof beats promises. Move each project from idea to building to shipped; shipped projects feed your Digital Resume automatically.</p>' +
        '<div class="row between"><div class="seg"><button class="' + (tab === "pipeline" ? "on" : "") + '" data-act="tab" data-t="pipeline">Pipeline</button><button class="' + (tab === "portfolio" ? "on" : "") + '" data-act="tab" data-t="portfolio">Portfolio (' + shipped + ")</button></div>" +
        (tab === "pipeline" ? '<button class="btn primary" data-act="add">+ Add project</button>' : "") + "</div>" +
        (tab === "portfolio" ? portfolio() : (adding ? '<div class="card">' + form(newP, true) + "</div>" : "") + '<div class="stack">' + list.map(card).join("") + "</div>") + "</div>";

      el.onclick = function (ev) {
        var t = ev.target.closest("[data-act]"); if (!t) return;
        var a = t.dataset.act, p = t.dataset.id && find(t.dataset.id);
        if (a === "tab") { tab = t.dataset.t; }
        else if (a === "add") { adding = true; editing = null; }
        else if (a === "cancel") { adding = false; editing = null; }
        else if (a === "edit") { editing = p.id; adding = false; }
        else if (a === "status") { if (p.status !== t.dataset.s) { p.status = t.dataset.s; if (p.status === "shipped") { p.shippedAt = Date.now(); H.touch(); } else delete p.shippedAt; H.save(); } }
        else if (a === "del") {
          if (armedDelete === p.id) { H.store.projects = list.filter(function (x) { return x.id !== p.id; }); armedDelete = null; H.save(); }
          else { armedDelete = p.id; setTimeout(function () { armedDelete = null; }, 4000); }
        }
        H.views.projects.render(el);
      };
      el.onsubmit = function (ev) {
        ev.preventDefault();
        var f = ev.target, d = f.dataset.id, fd = {};
        ["title", "desc", "skills", "repo", "demo", "writeup", "note"].forEach(function (k) { fd[k] = f.elements[k].value.trim(); });
        var p = find(d);
        if (!p) { p = newP; H.store.projects.push(p); }
        p.title = fd.title; p.desc = fd.desc; p.repo = fd.repo; p.demo = fd.demo; p.writeup = fd.writeup; p.note = fd.note;
        p.skills = fd.skills.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
        editing = null; adding = false; H.save(); H.views.projects.render(el);
      };
    }
  };
})();
