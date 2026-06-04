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
})();
