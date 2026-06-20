
(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-main-nav]');

  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function setHero(nextIndex) {
      index = nextIndex;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        setHero(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        setHero((index + 1) % slides.length);
      }, 5200);
    }
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach(function (panel) {
    var input = panel.querySelector('[data-search-input]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var regionSelect = panel.querySelector('[data-filter-region]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var container = panel.parentElement;
    var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card, .rank-item'));

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : '';
    }

    function applyFilter() {
      var keyword = valueOf(input);
      var type = valueOf(typeSelect);
      var region = valueOf(regionSelect);
      var year = valueOf(yearSelect);

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year')
        ].join(' ').toLowerCase();
        var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var okType = !type || (card.getAttribute('data-type') || '').toLowerCase() === type;
        var okRegion = !region || (card.getAttribute('data-region') || '').toLowerCase() === region;
        var okYear = !year || (card.getAttribute('data-year') || '').toLowerCase() === year;
        card.classList.toggle('is-hidden', !(okKeyword && okType && okRegion && okYear));
      });
    }

    [input, typeSelect, regionSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });
})();
