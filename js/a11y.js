(function () {
  function getMainFocusTarget(main) {
    return main.querySelector(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  function focusMainContent() {
    var main = document.getElementById("main-content");
    if (!main) {
      return;
    }

    var target = getMainFocusTarget(main) || main;
    target.focus({ preventScroll: true });
  }

  function initMainSkipTarget() {
    var main = document.getElementById("main-content");
    if (main && !main.hasAttribute("tabindex")) {
      main.setAttribute("tabindex", "-1");
    }

    var skip = document.querySelector(".skip-link");
    if (skip) {
      skip.addEventListener("click", function () {
        requestAnimationFrame(focusMainContent);
      });
    }

    if (window.location.hash === "#main-content") {
      requestAnimationFrame(focusMainContent);
    }
  }

  function initExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(function (anchor) {
      var rel = (anchor.getAttribute("rel") || "").trim().split(/\s+/).filter(Boolean);
      ["noopener", "noreferrer"].forEach(function (token) {
        if (rel.indexOf(token) === -1) {
          rel.push(token);
        }
      });
      anchor.setAttribute("rel", rel.join(" "));

      var text = (anchor.textContent || "").toLowerCase();
      if (/new tab|new window/.test(text)) {
        return;
      }
      if (anchor.querySelector(".visually-hidden[data-new-tab-hint]")) {
        return;
      }

      var hint = document.createElement("span");
      hint.className = "visually-hidden";
      hint.setAttribute("data-new-tab-hint", "true");
      hint.textContent = " (opens in new tab)";
      anchor.appendChild(hint);
    });
  }

  function init() {
    initMainSkipTarget();
    initExternalLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
