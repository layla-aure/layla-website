(function () {
  var STORAGE_KEY = "blocktag_settings";
  var SETTINGS_EVENT = "blocktag-settings-change";
  var root = document.documentElement;
  var systemMedia = window.matchMedia("(prefers-color-scheme: dark)");

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

  function mergeSettings(partial) {
    var current = readSettings();
    Object.keys(partial).forEach(function (key) {
      current[key] = partial[key];
    });
    writeSettings(current);
    return current;
  }

  function resolveDarkMode(settings) {
    if (settings["respect-system-theme"]) {
      return systemMedia.matches;
    }
    return !!settings["dark-mode"];
  }

  function applyThemes(settings) {
    settings = settings || readSettings();
    root.classList.toggle("minecraft-theme", !!settings["minecraft-theme"]);
    root.classList.toggle("dark-mode", resolveDarkMode(settings));
    document.dispatchEvent(
      new CustomEvent(SETTINGS_EVENT, { detail: settings })
    );
  }

  function updateSettings(partial) {
    var settings = mergeSettings(partial);
    applyThemes(settings);
    return settings;
  }

  function syncThemeButton(btn) {
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

  function injectThemeToggle() {
    if (document.querySelector(".theme-toggle")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    syncThemeButton(btn);

    btn.addEventListener("click", function () {
      var settings = readSettings();
      updateSettings({ "minecraft-theme": !settings["minecraft-theme"] });
      syncThemeButton(btn);
    });

    document.body.appendChild(btn);
    if (window.placeThemeToggle) {
      window.placeThemeToggle();
    }
  }

  function initSettingsPage() {
    var respectEl = document.getElementById("setting-respect-system");
    var darkEl = document.getElementById("setting-dark-mode");
    var minecraftEl = document.getElementById("setting-minecraft-theme");
    if (!respectEl || !darkEl || !minecraftEl) return;

    function syncSettingsUI() {
      var settings = readSettings();
      respectEl.checked = !!settings["respect-system-theme"];
      darkEl.checked = !!settings["dark-mode"];
      darkEl.disabled = respectEl.checked;
      minecraftEl.checked = !!settings["minecraft-theme"];
    }

    respectEl.addEventListener("change", function () {
      updateSettings({ "respect-system-theme": respectEl.checked });
      syncSettingsUI();
    });

    darkEl.addEventListener("change", function () {
      updateSettings({
        "dark-mode": darkEl.checked,
        "respect-system-theme": false
      });
      syncSettingsUI();
    });

    minecraftEl.addEventListener("change", function () {
      updateSettings({ "minecraft-theme": minecraftEl.checked });
      syncSettingsUI();
    });

    document.addEventListener(SETTINGS_EVENT, syncSettingsUI);
    syncSettingsUI();
  }

  systemMedia.addEventListener("change", function () {
    var settings = readSettings();
    if (settings["respect-system-theme"]) {
      applyThemes(settings);
    }
  });

  applyThemes(readSettings());

  document.addEventListener(SETTINGS_EVENT, function () {
    var btn = document.querySelector(".theme-toggle");
    if (btn) syncThemeButton(btn);
  });

  function init() {
    injectThemeToggle();
    initSettingsPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.BlocktagTheme = {
    readSettings: readSettings,
    updateSettings: updateSettings,
    applyThemes: applyThemes
  };
})();
