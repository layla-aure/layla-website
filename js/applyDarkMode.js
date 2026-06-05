(function () {
  var STORAGE_KEY = "blocktag_settings";

  function readSettings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  // Apply persisted themes as early as possible to minimize flash.
  var settings = readSettings();
  var root = document.documentElement;
  if (settings["dark-mode"]) {
    root.classList.add("dark-mode");
  }
  if (settings["minecraft-theme"]) {
    root.classList.add("minecraft-theme");
  }

  function syncButton(btn) {
    var on = root.classList.contains("minecraft-theme");
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      on ? "Switch to the clean theme" : "Switch to the Minecraft theme"
    );
    btn.title = on
      ? "Switch to the clean theme"
      : "Switch to the Minecraft theme";
  }

  function injectToggle() {
    if (document.querySelector(".theme-toggle")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    syncButton(btn);

    btn.addEventListener("click", function () {
      var on = root.classList.toggle("minecraft-theme");
      var current = readSettings();
      current["minecraft-theme"] = on;
      writeSettings(current);
      syncButton(btn);
    });

    document.body.appendChild(btn);
    if (window.placeThemeToggle) {
      window.placeThemeToggle();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectToggle);
  } else {
    injectToggle();
  }
})();
