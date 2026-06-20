(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        var open = mobileNav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var hero = document.querySelector('.hero-carousel');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var thumbs = Array.prototype.slice.call(hero.querySelectorAll('.hero-thumb'));
      var current = 0;
      var timer = null;

      function setSlide(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === current);
        });
        thumbs.forEach(function (thumb, i) {
          thumb.classList.toggle('active', i === current);
        });
      }

      function start() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          setSlide(current + 1);
        }, 5200);
      }

      var next = hero.querySelector('.hero-next');
      var prev = hero.querySelector('.hero-prev');
      if (next) {
        next.addEventListener('click', function () {
          setSlide(current + 1);
          start();
        });
      }
      if (prev) {
        prev.addEventListener('click', function () {
          setSlide(current - 1);
          start();
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          setSlide(Number(dot.getAttribute('data-go')) || 0);
          start();
        });
      });
      thumbs.forEach(function (thumb) {
        thumb.addEventListener('mouseenter', function () {
          setSlide(Number(thumb.getAttribute('data-go')) || 0);
          start();
        });
      });
      setSlide(0);
      start();
    }

    var scope = document.querySelector('.filter-scope');
    var input = document.querySelector('.filter-input');
    var selects = Array.prototype.slice.call(document.querySelectorAll('.filter-select'));
    var empty = document.querySelector('.empty-state');
    if (scope && (input || selects.length)) {
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      function applyFilters() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var filters = {};
        selects.forEach(function (select) {
          filters[select.getAttribute('data-filter')] = select.value;
        });
        var shown = 0;
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-year'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-category')
          ].join(' ').toLowerCase();
          var matched = !keyword || haystack.indexOf(keyword) !== -1;
          Object.keys(filters).forEach(function (key) {
            if (filters[key] && card.getAttribute('data-' + key) !== filters[key]) {
              matched = false;
            }
          });
          card.hidden = !matched;
          if (matched) {
            shown += 1;
          }
        });
        if (empty) {
          empty.hidden = shown !== 0;
        }
      }
      if (input) {
        input.addEventListener('input', applyFilters);
      }
      selects.forEach(function (select) {
        select.addEventListener('change', applyFilters);
      });
      applyFilters();
    }

    var globalInput = document.getElementById('globalSearchInput');
    var globalCategory = document.getElementById('globalCategoryFilter');
    var results = document.getElementById('searchResults');
    if (globalInput && results && window.SEARCH_MOVIES) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q') || '';
      globalInput.value = query;

      function cardTemplate(movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
          return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return [
          '<article class="movie-card" data-title="', escapeHtml(movie.title), '" data-region="', escapeHtml(movie.region), '" data-year="', escapeHtml(movie.year), '" data-genre="', escapeHtml(movie.genre), '" data-category="', escapeHtml(movie.category), '">',
          '<a class="poster-link" href="', escapeHtml(movie.href), '" aria-label="', escapeHtml(movie.title), '">',
          '<img src="', escapeHtml(movie.image), '" alt="', escapeHtml(movie.title), '" loading="lazy">',
          '<span class="card-glow"></span><span class="play-badge">▶</span></a>',
          '<div class="movie-card-body"><div class="card-meta"><span>', escapeHtml(movie.year), '</span><span>', escapeHtml(movie.region), '</span><span>', escapeHtml(movie.type), '</span></div>',
          '<h2><a href="', escapeHtml(movie.href), '">', escapeHtml(movie.title), '</a></h2>',
          '<p>', escapeHtml(movie.oneLine), '</p><div class="tag-row">', tags, '</div></div></article>'
        ].join('');
      }

      function escapeHtml(value) {
        return String(value || '').replace(/[&<>"]/g, function (char) {
          return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;'
          }[char];
        });
      }

      function renderSearch() {
        var term = globalInput.value.trim().toLowerCase();
        var category = globalCategory ? globalCategory.value : '';
        var list = window.SEARCH_MOVIES.filter(function (movie) {
          var text = [movie.title, movie.region, movie.year, movie.genre, movie.category, movie.tags.join(' ')].join(' ').toLowerCase();
          return (!term || text.indexOf(term) !== -1) && (!category || movie.category === category);
        }).slice(0, 120);
        results.innerHTML = list.map(cardTemplate).join('') || '<p class="empty-state">没有匹配结果</p>';
      }

      globalInput.addEventListener('input', renderSearch);
      if (globalCategory) {
        globalCategory.addEventListener('change', renderSearch);
      }
      renderSearch();
    }
  });
})();
