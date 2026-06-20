(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var button = document.querySelector(".menu-toggle");
        var menu = document.querySelector(".mobile-menu");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function initFilters() {
        var wrappers = document.querySelectorAll("[data-filter-scope]");
        wrappers.forEach(function (wrapper) {
            var input = wrapper.querySelector("[data-search-input]");
            var select = wrapper.querySelector("[data-filter-select]");
            var cards = Array.prototype.slice.call(wrapper.querySelectorAll(".movie-card"));
            var empty = wrapper.querySelector(".no-results");

            function apply() {
                var term = normalize(input ? input.value : "");
                var chosen = select ? select.value : "all";
                var visible = 0;

                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-tags")
                    ].join(" "));
                    var year = card.getAttribute("data-year") || "";
                    var genre = card.getAttribute("data-genre") || "";
                    var region = card.getAttribute("data-region") || "";
                    var matchesText = !term || text.indexOf(term) !== -1;
                    var matchesSelect = chosen === "all" || year === chosen || genre.indexOf(chosen) !== -1 || region === chosen;
                    var show = matchesText && matchesSelect;
                    card.style.display = show ? "block" : "none";
                    if (show) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            if (input) {
                input.addEventListener("input", apply);
            }
            if (select) {
                select.addEventListener("change", apply);
            }
            apply();
        });
    }

    window.initMoviePlayer = function (source) {
        var video = document.getElementById("movie-player");
        var cover = document.querySelector(".player-cover");
        if (!video || !source) {
            return;
        }

        var hlsInstance = null;
        var hasAttached = false;

        function attach() {
            if (hasAttached) {
                return;
            }
            hasAttached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function begin() {
            attach();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var playResult = video.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener("click", begin);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                begin();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    ready(function () {
        initMenu();
        initFilters();
    });
})();
