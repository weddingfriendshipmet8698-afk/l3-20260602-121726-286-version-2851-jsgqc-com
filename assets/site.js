(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.hero-tab'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });
    tabs.forEach(function (tab, tabIndex) {
      tab.classList.toggle('is-active', tabIndex === activeSlide);
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function applyListFilter(scope) {
    var input = scope.querySelector('[data-filter-input]');
    var year = scope.querySelector('[data-filter-year]');
    var type = scope.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search]'));
    var empty = scope.querySelector('[data-empty]');
    var visible = 0;
    var q = normalize(input && input.value);
    var yearValue = normalize(year && year.value);
    var typeValue = normalize(type && type.value);

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var cardYear = normalize(card.getAttribute('data-year'));
      var cardType = normalize(card.getAttribute('data-type'));
      var ok = true;

      if (q && text.indexOf(q) === -1) {
        ok = false;
      }
      if (yearValue && cardYear !== yearValue) {
        ok = false;
      }
      if (typeValue && cardType !== typeValue) {
        ok = false;
      }

      card.style.display = ok ? '' : 'none';
      if (ok) {
        visible += 1;
      }
    });

    if (empty) {
      empty.style.display = visible ? 'none' : 'block';
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]')).forEach(function (scope) {
    var params = new URLSearchParams(window.location.search);
    var input = scope.querySelector('[data-filter-input]');
    if (input && params.get('q')) {
      input.value = params.get('q');
    }

    Array.prototype.slice.call(scope.querySelectorAll('[data-filter-input], [data-filter-year], [data-filter-type]')).forEach(function (field) {
      field.addEventListener('input', function () {
        applyListFilter(scope);
      });
      field.addEventListener('change', function () {
        applyListFilter(scope);
      });
    });

    applyListFilter(scope);
  });

  function startPlayer(button) {
    var box = button.closest('[data-player]');
    if (!box) {
      return;
    }

    var video = box.querySelector('video');
    var source = button.getAttribute('data-src');
    var overlay = box.querySelector('.player-start');

    if (!video || !source) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      }, { once: true });
    } else {
      video.src = source;
      video.play();
    }

    video.controls = true;
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-play]')).forEach(function (button) {
    button.addEventListener('click', function () {
      startPlayer(button);
    });
  });
})();
