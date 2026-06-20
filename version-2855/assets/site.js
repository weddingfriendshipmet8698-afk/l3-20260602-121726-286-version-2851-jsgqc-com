(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function bindMenu() {
    var button = qs('.menu-button');
    var panel = qs('.mobile-panel');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      var isOpen = panel.hasAttribute('hidden');
      if (isOpen) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
      button.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function bindHero() {
    var carousel = qs('.hero-carousel');
    if (!carousel) {
      return;
    }
    var slides = qsa('.hero-slide', carousel);
    var dots = qsa('.hero-dot', carousel);
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('active', position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('active', position === index);
      });
    }
    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }
    dots.forEach(function (dot, position) {
      dot.addEventListener('click', function () {
        show(position);
        start();
      });
    });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function bindFilters() {
    var input = qs('.filter-input');
    var cards = qsa('.movie-card');
    if (!input || !cards.length) {
      return;
    }
    var selects = qsa('.filter-select');
    var empty = qs('.empty-state');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query) {
      input.value = query;
    }
    function apply() {
      var keyword = normalize(input.value);
      var values = {};
      selects.forEach(function (select) {
        values[select.getAttribute('data-filter')] = normalize(select.value);
      });
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type')
        ].join(' '));
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchGenre = !values.genre || normalize(card.getAttribute('data-genre')).indexOf(values.genre) !== -1;
        var matchYear = !values.year || normalize(card.getAttribute('data-year')) === values.year;
        var show = matchKeyword && matchGenre && matchYear;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }
    input.addEventListener('input', apply);
    selects.forEach(function (select) {
      select.addEventListener('change', apply);
    });
    apply();
  }

  window.setupMoviePlayer = function (videoId, buttonId, overlayId, streamUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var overlay = document.getElementById(overlayId);
    if (!video || !button || !overlay || !streamUrl) {
      return;
    }
    var ready = false;
    var hls = null;
    function prepare() {
      if (ready) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      ready = true;
    }
    function play() {
      prepare();
      overlay.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    }
    button.addEventListener('click', play);
    overlay.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    bindMenu();
    bindHero();
    bindFilters();
  });
})();
