(function () {
  var overlay = null;
  var lastFocused = null;
  var inertTargets = [];

  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function getFocusable(container) {
    return Array.prototype.filter.call(
      container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ),
      isVisible
    );
  }

  function setBackgroundInert(inert) {
    inertTargets.forEach(function (el) {
      if (inert) {
        el.setAttribute("inert", "");
      } else {
        el.removeAttribute("inert");
      }
    });
  }

  function collectInertTargets() {
    inertTargets = Array.prototype.slice.call(
      document.querySelectorAll(".app-layout, .app-footer, .skip-link, .theme-toggle")
    );
  }

  function trapFocus(event) {
    if (!overlay || overlay.hidden) {
      return;
    }

    var focusable = getFocusable(overlay);
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
  }

  function createOverlay() {
    overlay = document.createElement("div");
    overlay.className = "image-lightbox";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Enlarged image");
    overlay.innerHTML =
      '<button type="button" class="image-lightbox__close" aria-label="Close enlarged image">&times;</button>' +
      '<img class="image-lightbox__img" alt="" tabindex="-1">';

    document.body.appendChild(overlay);
    collectInertTargets();

    overlay.querySelector(".image-lightbox__close").addEventListener("click", closeLightbox);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeLightbox();
      }
    });
  }

  function openLightbox(img) {
    if (!overlay) {
      createOverlay();
    }

    var lightboxImg = overlay.querySelector(".image-lightbox__img");
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "";

    lastFocused = img;
    overlay.hidden = false;
    document.body.classList.add("image-lightbox-open");
    setBackgroundInert(true);
    overlay.querySelector(".image-lightbox__close").focus();
  }

  function closeLightbox() {
    if (!overlay || overlay.hidden) {
      return;
    }

    overlay.hidden = true;
    document.body.classList.remove("image-lightbox-open");
    setBackgroundInert(false);
    overlay.querySelector(".image-lightbox__img").removeAttribute("src");

    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  function isEnlargeableImage(img) {
    return img && !img.closest(".image-lightbox") && !img.closest(".pdf-lightbox");
  }

  function initEnlargeableImages() {
    document.querySelectorAll("img").forEach(function (img) {
      if (!isEnlargeableImage(img) || img.dataset.lightboxReady) {
        return;
      }

      img.dataset.lightboxReady = "true";
      img.tabIndex = 0;
      img.setAttribute("role", "button");

      var label = img.alt ? "View enlarged: " + img.alt : "View enlarged image";
      img.setAttribute("aria-label", label);
    });
  }

  function activateFromImage(img) {
    if (!isEnlargeableImage(img)) {
      return;
    }
    openLightbox(img);
  }

  document.addEventListener("click", function (event) {
    var img = event.target.closest("img");
    if (!isEnlargeableImage(img)) {
      return;
    }

    event.preventDefault();
    activateFromImage(img);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (event.key !== "Tab") {
      if ((event.key === "Enter" || event.key === " ") && event.target.closest("img")) {
        var img = event.target.closest("img");
        if (isEnlargeableImage(img)) {
          event.preventDefault();
          activateFromImage(img);
        }
      }
      return;
    }

    trapFocus(event);
  });

  function markSquareProjectImages() {
    document.querySelectorAll(".detail-section > img").forEach(function (img) {
      function apply() {
        var w = img.naturalWidth;
        var h = img.naturalHeight;
        if (w && h && Math.abs(w / h - 1) < 0.05) {
          img.classList.add("is-square");
        }
      }

      if (img.complete && img.naturalWidth) {
        apply();
      } else {
        img.addEventListener("load", apply, { once: true });
      }
    });
  }

  function init() {
    initEnlargeableImages();
    markSquareProjectImages();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
