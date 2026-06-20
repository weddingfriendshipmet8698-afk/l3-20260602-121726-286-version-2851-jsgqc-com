(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var activeIndex = 0;
    var timer = null;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === activeIndex);
      });
    };

    var move = function (step) {
      showSlide(activeIndex + step);
    };

    var start = function () {
      timer = window.setInterval(function () {
        move(1);
      }, 5000);
    };

    var reset = function () {
      window.clearInterval(timer);
      start();
    };

    if (prev) {
      prev.addEventListener('click', function () {
        move(-1);
        reset();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        move(1);
        reset();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        reset();
      });
    });

    showSlide(0);
    start();
  }

  var filterPanel = document.querySelector('[data-filter-panel]');

  if (filterPanel) {
    var input = filterPanel.querySelector('[data-filter-input]');
    var year = filterPanel.querySelector('[data-year-filter]');
    var type = filterPanel.querySelector('[data-type-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-list] .movie-card, [data-card-list] .rank-row'));
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (input && query) {
      input.value = query;
    }

    var normalize = function (value) {
      return String(value || '').toLowerCase().trim();
    };

    var filterCards = function () {
      var term = normalize(input ? input.value : '');
      var selectedYear = year ? year.value : '';
      var selectedType = type ? type.value : '';

      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.tags,
          card.dataset.region,
          card.dataset.type,
          card.dataset.category,
          card.dataset.year
        ].join(' '));
        var matchTerm = !term || haystack.indexOf(term) !== -1;
        var matchYear = !selectedYear || card.dataset.year === selectedYear;
        var matchType = !selectedType || card.dataset.type === selectedType;
        card.classList.toggle('is-hidden', !(matchTerm && matchYear && matchType));
      });
    };

    if (input) {
      input.addEventListener('input', filterCards);
    }

    if (year) {
      year.addEventListener('change', filterCards);
    }

    if (type) {
      type.addEventListener('change', filterCards);
    }

    filterCards();
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.play-overlay');
    var streamUrl = player.getAttribute('data-stream');
    var hlsInstance = null;

    if (!video || !overlay || !streamUrl) {
      return;
    }

    var startPlayback = function () {
      if (video.dataset.ready !== 'true') {
        video.dataset.ready = 'true';

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      }

      player.classList.add('is-playing');
      overlay.hidden = true;
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          overlay.hidden = false;
          player.classList.remove('is-playing');
        });
      }
    };

    overlay.addEventListener('click', startPlayback);

    video.addEventListener('play', function () {
      overlay.hidden = true;
      player.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (!video.ended && video.currentTime === 0) {
        overlay.hidden = false;
        player.classList.remove('is-playing');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
