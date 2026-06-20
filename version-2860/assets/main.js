(function () {
  var toggle = document.querySelector(".menu-toggle");
  var panel = document.querySelector(".mobile-panel");

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, 5200);
    }
  }

  var filterScope = document.querySelector("[data-filter-scope]");
  if (filterScope) {
    var keywordInput = filterScope.querySelector("[data-filter-keyword]");
    var yearSelect = filterScope.querySelector("[data-filter-year]");
    var typeSelect = filterScope.querySelector("[data-filter-type]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card-list] .movie-card"));

    function applyFilter() {
      var keyword = (keywordInput.value || "").trim().toLowerCase();
      var year = yearSelect.value;
      var type = typeSelect.value;

      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchYear = !year || card.getAttribute("data-year") === year;
        var matchType = !type || card.getAttribute("data-type") === type;
        card.style.display = matchKeyword && matchYear && matchType ? "" : "none";
      });
    }

    [keywordInput, yearSelect, typeSelect].forEach(function (element) {
      element.addEventListener("input", applyFilter);
      element.addEventListener("change", applyFilter);
    });
  }

  if (window.SEARCH_MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get("q") || "").trim();
    var title = document.querySelector("[data-search-title]");
    var box = document.querySelector("[data-search-results]");
    var searchInput = document.querySelector(".big-search input[name='q']");

    if (searchInput) {
      searchInput.value = q;
    }

    if (q && box) {
      var key = q.toLowerCase();
      var results = window.SEARCH_MOVIES.filter(function (movie) {
        return movie.searchText.indexOf(key) !== -1;
      }).slice(0, 120);

      if (title) {
        title.textContent = "与“" + q + "”相关的内容";
      }

      box.innerHTML = results.map(function (movie) {
        return [
          '<article class="movie-card">',
          '<a class="poster-link" href="' + movie.link + '" aria-label="' + movie.title + '">',
          '<span class="poster" style="background-image: url(\'' + movie.cover + '\');"></span>',
          '<span class="poster-badge">' + movie.year + '</span>',
          '</a>',
          '<div class="movie-card-body">',
          '<h3><a href="' + movie.link + '">' + movie.title + '</a></h3>',
          '<p class="movie-meta">' + movie.region + ' · ' + movie.type + ' · ' + movie.genre + '</p>',
          '<p class="movie-one-line">' + movie.oneLine + '</p>',
          '<div class="tag-row">' + movie.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join("") + '</div>',
          '</div>',
          '</article>'
        ].join("");
      }).join("") || '<p class="movie-meta">未找到匹配内容</p>';
    }
  }
})();
