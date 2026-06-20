(function () {
    var navButton = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (navButton && nav) {
        navButton.addEventListener('click', function () {
            var opened = nav.classList.toggle('open');
            navButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
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
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5000);
    }

    function restartHero() {
        if (timer) {
            window.clearInterval(timer);
        }
        startHero();
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            restartHero();
        });
    });

    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    if (prev) {
        prev.addEventListener('click', function () {
            showSlide(current - 1);
            restartHero();
        });
    }
    if (next) {
        next.addEventListener('click', function () {
            showSlide(current + 1);
            restartHero();
        });
    }
    startHero();

    var searchInput = document.getElementById('site-search');
    var searchCards = Array.prototype.slice.call(document.querySelectorAll('#search-results .movie-card'));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var activeFilter = '';

    function applySearch() {
        if (!searchInput || !searchCards.length) {
            return;
        }
        var query = searchInput.value.trim().toLowerCase();
        searchCards.forEach(function (card) {
            var haystack = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-meta') || '',
                card.getAttribute('data-tags') || ''
            ].join(' ').toLowerCase();
            var matchQuery = !query || haystack.indexOf(query) !== -1;
            var matchFilter = !activeFilter || haystack.indexOf(activeFilter.toLowerCase()) !== -1;
            card.style.display = matchQuery && matchFilter ? '' : 'none';
        });
    }

    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q');
        if (initial) {
            searchInput.value = initial;
        }
        searchInput.addEventListener('input', applySearch);
        applySearch();
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeFilter = button.getAttribute('data-filter') || '';
            filterButtons.forEach(function (b) {
                b.classList.toggle('active', b === button);
            });
            applySearch();
        });
    });
})();

function initMoviePlayer(elementId, streamUrl) {
    var video = document.getElementById(elementId);
    var startButton = document.querySelector('.video-start');
    var statusBox = document.querySelector('.video-status');
    var hlsInstance = null;

    function setStatus(message) {
        if (statusBox) {
            statusBox.textContent = message || '';
        }
    }

    function attachStream() {
        if (!video || !streamUrl) {
            setStatus('视频暂时无法载入');
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                setStatus('');
            });
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    setStatus('视频暂时无法载入');
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        } else {
            video.src = streamUrl;
        }
    }

    function playVideo() {
        if (!video) {
            return;
        }
        if (!video.getAttribute('src') && !hlsInstance) {
            attachStream();
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(function () {
                if (startButton) {
                    startButton.classList.add('hidden');
                }
            }).catch(function () {
                setStatus('点击播放器开始播放');
            });
        }
    }

    attachStream();
    if (startButton) {
        startButton.addEventListener('click', playVideo);
    }
    if (video) {
        video.addEventListener('play', function () {
            if (startButton) {
                startButton.classList.add('hidden');
            }
        });
        video.addEventListener('pause', function () {
            if (startButton) {
                startButton.classList.remove('hidden');
            }
        });
    }
}
