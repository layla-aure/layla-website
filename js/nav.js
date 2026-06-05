(function () {
  document.querySelectorAll(".nav-group").forEach(function (group, index) {
    var btn = group.querySelector(".nav-group-toggle");
    var subnav = group.querySelector(".nav-subnav");
    if (!btn || !subnav) {
      return;
    }

    var id = subnav.id || "nav-subnav-" + (index + 1);
    subnav.id = id;
    btn.setAttribute("aria-controls", id);
  });

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
  if (!sidebar || !navLinks) {
    return;
  }

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

  var menuInertTargets = Array.prototype.slice.call(
    document.querySelectorAll(".main-content, .app-footer, .skip-link")
  );

  function isMobileNav() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function getSidebarFocusable() {
    return Array.prototype.filter.call(
      sidebar.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ),
      isVisible
    );
  }

  function setMenuInert(inert) {
    menuInertTargets.forEach(function (el) {
      if (inert) {
        el.setAttribute("inert", "");
      } else {
        el.removeAttribute("inert");
      }
    });
  }

  function placeThemeToggle() {
    var themeToggle = document.querySelector(".theme-toggle");
    if (!themeToggle) {
      return;
    }

    if (isMobileNav()) {
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
  window.addEventListener("resize", function () {
    if (!isMobileNav()) {
      setMenuInert(false);
    } else if (sidebar.classList.contains("nav-open")) {
      setMenuInert(true);
    }
  });

  function setMenuOpen(open) {
    sidebar.classList.toggle("nav-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    setMenuInert(open && isMobileNav());
  }

  menuBtn.addEventListener("click", function () {
    setMenuOpen(!sidebar.classList.contains("nav-open"));
  });

  navLinks.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && sidebar.classList.contains("nav-open")) {
      setMenuOpen(false);
      menuBtn.focus();
      return;
    }

    if (event.key !== "Tab" || !sidebar.classList.contains("nav-open") || !isMobileNav()) {
      return;
    }

    var focusable = getSidebarFocusable();
    if (!focusable.length) {
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
