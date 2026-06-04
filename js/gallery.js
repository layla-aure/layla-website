(function () {
  var container = document.getElementById("photo-gallery");
  var images = window.GALLERY_IMAGES;
  var items = [];

  if (!container || !images || !images.length) {
    return;
  }

  function getGridMetrics() {
    var style = getComputedStyle(container);
    var gap = parseFloat(style.rowGap) || 16;
    var rowUnit = parseFloat(style.getPropertyValue("--gallery-row")) || 10;
    var minCol = parseFloat(style.getPropertyValue("--gallery-col-min")) || 180;
    var columns = Math.max(1, Math.floor((container.clientWidth + gap) / (minCol + gap)));
    var colWidth = (container.clientWidth - (columns - 1) * gap) / columns;

    return { gap: gap, rowUnit: rowUnit, columns: columns, colWidth: colWidth };
  }

  function heightToRowSpan(height, gap, rowUnit) {
    return Math.max(1, Math.ceil((height + gap) / (rowUnit + gap)));
  }

  function classifyImage(width, height) {
    var ratio = width / height;

    if (ratio > 2) {
      return { type: "panorama", colSpan: 3 };
    }

    if (ratio > 1.15) {
      return { type: "landscape", colSpan: 2 };
    }

    if (ratio < 0.87) {
      return {
        type: ratio < 0.5 ? "tall-portrait" : "portrait",
        colSpan: 1
      };
    }

    return { type: "square", colSpan: 1 };
  }

  function applyLayout(figure, img) {
    var width = img.naturalWidth;
    var height = img.naturalHeight;

    if (!width || !height) {
      return;
    }

    var metrics = getGridMetrics();
    var info = classifyImage(width, height);
    var colSpan = Math.min(info.colSpan, metrics.columns);
    var itemWidth = colSpan * metrics.colWidth + (colSpan - 1) * metrics.gap;
    var itemHeight = itemWidth * (height / width);
    var rowSpan = heightToRowSpan(itemHeight, metrics.gap, metrics.rowUnit);

    figure.className = "photo-gallery__item is-" + info.type;
    figure.style.gridColumn = "span " + colSpan;
    figure.style.gridRow = "span " + rowSpan;
  }

  function layoutAll() {
    items.forEach(function (item) {
      applyLayout(item.figure, item.img);
    });
  }

  images.forEach(function (entry) {
    var src = typeof entry === "string" ? entry : entry.src;
    var alt = typeof entry === "string" ? "" : (entry.alt || "");

    var figure = document.createElement("figure");
    figure.className = "photo-gallery__item";

    var img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";

    function onReady() {
      applyLayout(figure, img);
    }

    if (img.complete && img.naturalWidth) {
      onReady();
    } else {
      img.addEventListener("load", onReady, { once: true });
    }

    figure.appendChild(img);
    container.appendChild(figure);
    items.push({ figure: figure, img: img });
  });

  if (typeof ResizeObserver !== "undefined") {
    var observer = new ResizeObserver(function () {
      layoutAll();
    });
    observer.observe(container);
  } else {
    window.addEventListener("resize", layoutAll);
  }
})();
