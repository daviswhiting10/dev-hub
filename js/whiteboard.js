// Whiteboard tab: the self-contained whiteboard.html fills the whole main area. It keeps its own board in this browser's localStorage.
(function () {
  "use strict";
  var H = Hub;
  H.views.whiteboard = {
    render: function (el) {
      el.innerHTML = '<iframe class="wb-full" src="whiteboard.html?v=' + H.esc(window.HUB_VERSION || "") + '" title="Whiteboard"></iframe>';
    }
  };
})();
