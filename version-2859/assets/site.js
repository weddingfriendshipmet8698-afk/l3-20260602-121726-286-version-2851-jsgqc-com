(function () {
    var navButton = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');

    if (navButton && nav) {
        navButton.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            navButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var params = new URLSearchParams(window.location.search);
    var queryFromUrl = params.get('q') || '';

    document.querySelectorAll('[data-library]').forEach(function (library) {
        var queryInput = library.querySelector('[data-filter-query]');
        var categorySelect = library.querySelector('[data-filter-category]');
        var typeSelect = library.querySelector('[data-filter-type]');
        var resetButton = library.querySelector('[data-filter-reset]');
        var cards = Array.prototype.slice.call(library.querySelectorAll('.movie-card'));

        if (queryInput && queryFromUrl) {
            queryInput.value = queryFromUrl;
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilters() {
            var query = normalize(queryInput && queryInput.value);
            var category = categorySelect ? categorySelect.value : '';
            var type = typeSelect ? typeSelect.value : '';

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.dataset.title,
                    card.dataset.year,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.genre,
                    card.dataset.tags
                ].join(' '));
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchCategory = !category || card.dataset.siteCategory === category;
                var matchType = !type || normalize(card.dataset.type).indexOf(normalize(type)) !== -1 || normalize(card.dataset.genre).indexOf(normalize(type)) !== -1;
                card.classList.toggle('is-hidden', !(matchQuery && matchCategory && matchType));
            });
        }

        [queryInput, categorySelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        if (resetButton) {
            resetButton.addEventListener('click', function () {
                if (queryInput) {
                    queryInput.value = '';
                }
                if (categorySelect) {
                    categorySelect.value = '';
                }
                if (typeSelect) {
                    typeSelect.value = '';
                }
                applyFilters();
            });
        }

        applyFilters();
    });
})();
