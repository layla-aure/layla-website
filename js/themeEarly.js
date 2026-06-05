(function () {
  var STORAGE_KEY = "blocktag_settings";
  try {
    var settings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    var root = document.documentElement;
    if (settings["minecraft-theme"]) {
      root.classList.add("minecraft-theme");
    }
    var dark = settings["respect-system-theme"]
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : !!settings["dark-mode"];
    if (dark) {
      root.classList.add("dark-mode");
    }
  } catch (e) {}
})();
