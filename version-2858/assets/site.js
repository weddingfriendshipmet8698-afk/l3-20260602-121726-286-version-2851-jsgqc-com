(function () {
  var menuButton = document.querySelector('.menu-button');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  function normalize(text) {
    return String(text || '').toLowerCase();
  }

  var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

  filterForms.forEach(function (scope) {
    var keywordInput = scope.querySelector('[data-filter-keyword]');
    var categorySelect = scope.querySelector('[data-filter-category]');
    var yearSelect = scope.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var empty = scope.querySelector('.empty-state');

    function applyFilter() {
      var keyword = normalize(keywordInput ? keywordInput.value : '');
      var category = categorySelect ? categorySelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region'));
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchCategory = !category || card.getAttribute('data-category') === category;
        var matchYear = !year || card.getAttribute('data-year') === year;
        var show = matchKeyword && matchCategory && matchYear;

        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [keywordInput, categorySelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('.player-card')).forEach(function (card) {
    var video = card.querySelector('video');
    var button = card.querySelector('[data-play-url]');
    var overlay = card.querySelector('.play-overlay');

    if (!video || !button || !overlay) {
      return;
    }

    function playVideo() {
      var url = button.getAttribute('data-play-url');

      overlay.classList.add('hidden');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (!video.getAttribute('src')) {
          video.setAttribute('src', url);
        }
        video.play().catch(function () {});
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        if (!video._hlsInstance) {
          var hls = new window.Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          video._hlsInstance = hls;
        }
        video.play().catch(function () {});
        return;
      }

      if (!video.getAttribute('src')) {
        video.setAttribute('src', url);
      }
      video.play().catch(function () {});
    }

    button.addEventListener('click', playVideo);
    overlay.addEventListener('click', playVideo);
  });
})();
