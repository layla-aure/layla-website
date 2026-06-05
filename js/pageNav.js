(function () {
  var PAGES = [
    { path: "index.html", label: "About" },
    { path: "documents/resume.html", label: "Resume" },
    { path: "documents/certifications.html", label: "Certifications" },
    { path: "projects/index.html", label: "All Projects" },
    { path: "projects/jarvis-ai.html", label: "JARVIS AI", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/splatbot.html", label: "Splatbot Game", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/social-network.html", label: "Social Network", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/spreadsheet.html", label: "Spreadsheet", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/teaching-assistant-db.html", label: "TA Database", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/vr-game.html", label: "VR Game", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/shell.html", label: "Shell", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/y86-interpreter.html", label: "Y86 Interpreter", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/fsm-calculator.html", label: "FSM Calculator", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/affine-cipher.html", label: "Affine Cipher", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/mixed-fraction-calculator.html", label: "Fraction Calculator", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "projects/asteroids.html", label: "Asteroids Game", backPath: "projects/index.html", backLabel: "All Projects" },
    { path: "timelines/education.html", label: "Education" },
    { path: "timelines/experience.html", label: "Experience" },
    { path: "timelines/music.html", label: "Music" },
    { path: "timelines/robotics.html", label: "Robotics" },
    { path: "videogames/minecraft.html", label: "Minecraft" },
    { path: "videogames/marvel-rivals.html", label: "Marvel Rivals" },
    { path: "gallery.html", label: "Gallery" }
  ];

  function pathPrefix() {
    var src = document.currentScript && document.currentScript.getAttribute("src");
    if (!src) return "";
    var match = src.match(/^(\.\.\/)+/);
    return match ? match[0] : "";
  }

  var SECTIONS = ["documents", "projects", "timelines", "videogames"];

  function normalizePath(pathname) {
    var parts = pathname.split("/").filter(Boolean);
    var file = (parts[parts.length - 1] || "index.html").toLowerCase();
    if (file === "index.html" && parts.length > 1) {
      var parent = parts[parts.length - 2].toLowerCase();
      if (SECTIONS.indexOf(parent) !== -1) {
        return parent + "/index.html";
      }
      return "index.html";
    }
    if (parts.length === 1) {
      return file;
    }
    return parts[parts.length - 2].toLowerCase() + "/" + file;
  }

  function hrefFor(targetPath) {
    return pathPrefix() + targetPath;
  }

  var BTN_CLASS = "page-bottom-nav__btn";

  function link(options) {
    var a = document.createElement("a");
    a.className = options.modifier ? BTN_CLASS + " " + options.modifier : BTN_CLASS;
    a.href = hrefFor(options.targetPath);
    a.setAttribute("aria-label", options.ariaLabel);

    var arrow = document.createElement("span");
    arrow.className = "page-bottom-nav__arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = options.arrow;

    var label = document.createElement("span");
    label.className = "page-bottom-nav__label";
    label.textContent = options.text;

    a.appendChild(arrow);
    a.appendChild(label);
    return a;
  }

  function currentIndex() {
    var current = normalizePath(window.location.pathname);
    for (var i = 0; i < PAGES.length; i++) {
      if (PAGES[i].path === current) return i;
    }
    return -1;
  }

  var card = document.querySelector(".page-card");
  if (!card) return;

  var index = currentIndex();
  if (index < 0) return;

  var page = PAGES[index];
  var prev = index > 0 ? PAGES[index - 1] : null;
  var next = index < PAGES.length - 1 ? PAGES[index + 1] : null;
  var backPath = page.backPath || (prev ? prev.path : null);
  var backLabel = page.backLabel || (prev ? prev.label : null);

  var nav = document.createElement("nav");
  nav.className = "page-bottom-nav";
  nav.setAttribute("aria-label", "Page navigation");

  var startGroup = document.createElement("div");
  startGroup.className = "page-bottom-nav__group";

  if (backPath && backLabel && (!prev || backPath !== prev.path)) {
    startGroup.appendChild(
      link({
        targetPath: backPath,
        modifier: "page-bottom-nav__back",
        arrow: "\u21A9",
        text: "\u2190 Back: " + backLabel,
        ariaLabel: "Back to " + backLabel
      })
    );
  }

  if (prev) {
    startGroup.appendChild(
      link({
        targetPath: prev.path,
        modifier: "page-bottom-nav__prev",
        arrow: "\u2190",
        text: "\u2190 " + prev.label,
        ariaLabel: "Previous: " + prev.label
      })
    );
  }

  var endGroup = document.createElement("div");
  endGroup.className = "page-bottom-nav__group page-bottom-nav__group--end";

  if (next) {
    endGroup.appendChild(
      link({
        targetPath: next.path,
        modifier: "page-bottom-nav__next",
        arrow: "\u2192",
        text: next.label + " \u2192",
        ariaLabel: "Next: " + next.label
      })
    );
  }

  if (startGroup.childElementCount) nav.appendChild(startGroup);
  if (endGroup.childElementCount) nav.appendChild(endGroup);
  if (!nav.childElementCount) return;

  card.appendChild(nav);
})();
