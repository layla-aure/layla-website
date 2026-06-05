(function () {
  var overlay = null;
  var lastFocused = null;

  function isMobilePdfView() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function createOverlay() {
    overlay = document.createElement("div");
    overlay.className = "pdf-lightbox";
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="pdf-lightbox__toolbar">' +
      '<a class="pdf-lightbox__open-tab" href="#" target="_blank" rel="noopener">Open in new tab</a>' +
      '<button type="button" class="pdf-lightbox__close" aria-label="Close certificate">&times;</button>' +
      "</div>" +
      '<iframe class="pdf-lightbox__frame" title="Certificate"></iframe>';

    document.body.appendChild(overlay);

    overlay.querySelector(".pdf-lightbox__close").addEventListener("click", closeLightbox);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeLightbox();
      }
    });
  }

  function openLightbox(link) {
    if (!overlay) {
      createOverlay();
    }

    var href = link.getAttribute("href");
    var heading = link.querySelector("h3");
    var title = heading ? heading.textContent : "Certificate";

    overlay.querySelector(".pdf-lightbox__open-tab").href = href;
    overlay.querySelector(".pdf-lightbox__frame").src = href;
    overlay.querySelector(".pdf-lightbox__frame").title = title;

    lastFocused = link;
    overlay.hidden = false;
    document.body.classList.add("pdf-lightbox-open");
    overlay.querySelector(".pdf-lightbox__close").focus();
  }

  function closeLightbox() {
    if (!overlay || overlay.hidden) {
      return;
    }

    overlay.hidden = true;
    document.body.classList.remove("pdf-lightbox-open");
    overlay.querySelector(".pdf-lightbox__frame").removeAttribute("src");

    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  document.addEventListener("click", function (event) {
    var card = event.target.closest(".cert-card");
    if (!card || card.closest(".pdf-lightbox")) {
      return;
    }

    event.preventDefault();

    if (isMobilePdfView()) {
      window.open(card.getAttribute("href"), "_blank", "noopener");
      return;
    }

    openLightbox(card);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
})();
