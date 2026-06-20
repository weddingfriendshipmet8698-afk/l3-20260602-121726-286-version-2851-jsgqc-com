(function () {
    function setupPlayer(shell) {
        var video = shell.querySelector('video');
        var cover = shell.querySelector('.player-cover');
        var stream = shell.getAttribute('data-stream');
        var loaded = false;
        var hls = null;

        if (!video || !cover || !stream) {
            return;
        }

        function loadStream() {
            if (loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function startPlayback() {
            loadStream();
            shell.classList.add('is-started');
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        cover.addEventListener('click', startPlayback);
        video.addEventListener('click', function () {
            if (!loaded || video.paused) {
                startPlayback();
            }
        });
        video.addEventListener('play', function () {
            shell.classList.add('is-started');
        });
        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
