(function () {
  var overlay = null;

  function createOverlay() {
    overlay = document.createElement("div");
    overlay.className = "image-lightbox";
    overlay.hidden = true;
    overlay.innerHTML =
      '<button type="button" class="image-lightbox__close" aria-label="Close enlarged image">&times;</button>' +
      '<img class="image-lightbox__img" alt="">';

    document.body.appendChild(overlay);

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

    overlay.hidden = false;
    document.body.classList.add("image-lightbox-open");
    overlay.querySelector(".image-lightbox__close").focus();
  }

  function closeLightbox() {
    if (!overlay || overlay.hidden) {
      return;
    }

    overlay.hidden = true;
    document.body.classList.remove("image-lightbox-open");
    overlay.querySelector(".image-lightbox__img").removeAttribute("src");
  }

  document.addEventListener("click", function (event) {
    var img = event.target.closest("img");
    if (!img || img.closest(".image-lightbox")) {
      return;
    }

    event.preventDefault();
    openLightbox(img);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markSquareProjectImages);
  } else {
    markSquareProjectImages();
  }
})();
