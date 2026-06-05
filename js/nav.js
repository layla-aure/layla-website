(function () {
  document.querySelectorAll(".nav-group-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = btn.closest(".nav-group");
      var isOpen = group.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen);
    });
  });

  document.querySelectorAll(".nav-subnav").forEach(function (subnav) {
    if (subnav.querySelector(".nav-link.active")) {
      var group = subnav.closest(".nav-group");
      group.classList.add("open");
      group.querySelector(".nav-group-toggle").setAttribute("aria-expanded", "true");
    }
  });

  var sidebar = document.querySelector(".sidebar");
  var navLinks = sidebar && sidebar.querySelector(".nav-links");
  if (!sidebar || !navLinks) return;

  navLinks.id = "primary-nav";

  var logo = sidebar.querySelector(".logo");
  var header = document.createElement("div");
  header.className = "sidebar-header";

  var menuBtn = document.createElement("button");
  menuBtn.type = "button";
  menuBtn.className = "nav-menu-toggle";
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-controls", "primary-nav");
  menuBtn.setAttribute("aria-label", "Open menu");
  menuBtn.innerHTML =
    '<span class="nav-menu-toggle__icon" aria-hidden="true">' +
    "<span></span><span></span><span></span></span>";

  sidebar.insertBefore(header, navLinks);
  if (logo) {
    header.appendChild(logo);
  }
  header.appendChild(menuBtn);

  function placeThemeToggle() {
    var themeToggle = document.querySelector(".theme-toggle");
    if (!themeToggle) return;

    if (window.matchMedia("(max-width: 768px)").matches) {
      if (themeToggle.parentElement !== header) {
        header.insertBefore(themeToggle, menuBtn);
      }
    } else if (themeToggle.parentElement !== document.body) {
      document.body.appendChild(themeToggle);
    }
  }

  window.placeThemeToggle = placeThemeToggle;
  placeThemeToggle();
  document.addEventListener("DOMContentLoaded", placeThemeToggle);
  window.addEventListener("resize", placeThemeToggle);

  function setMenuOpen(open) {
    sidebar.classList.toggle("nav-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuBtn.addEventListener("click", function () {
    setMenuOpen(!sidebar.classList.contains("nav-open"));
  });

  navLinks.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });
})();
