// Boot: load question banks, then start the router.
(function () {
  "use strict";
  var H = Hub;
  H.initProjects();
  H.loadBanks().then(function () {
    H.normalizeBanks();
    H.route();
    H.save();
  });
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.id === "exportBtn") H.exportData();
    if (t.id === "importBtn") H.$("#importFile").click();
  });
  document.addEventListener("change", function (e) {
    if (e.target.id === "importFile" && e.target.files[0]) H.importData(e.target.files[0]);
  });
})();
