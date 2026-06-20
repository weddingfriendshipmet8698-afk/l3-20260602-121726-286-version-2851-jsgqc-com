(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  var hlsPromise = null;

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (hlsPromise) {
      return hlsPromise;
    }
    hlsPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return hlsPromise;
  }

  function playVideo(video, button) {
    var src = video.getAttribute('data-src') || video.currentSrc || video.src;
    if (!src) {
      return;
    }
    if (button) {
      button.classList.add('is-hidden');
    }
    if (video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL')) {
      if (!video.src) {
        video.src = src;
      }
      video.play().catch(function () {});
      return;
    }
    loadHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        if (!video._hlsInstance) {
          var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90
          });
          hls.loadSource(src);
          hls.attachMedia(video);
          video._hlsInstance = hls;
        }
        video.play().catch(function () {});
      } else {
        video.src = src;
        video.play().catch(function () {});
      }
    }).catch(function () {
      video.src = src;
      video.play().catch(function () {});
    });
  }

  ready(function () {
    var video = document.querySelector('.movie-player');
    var button = document.querySelector('.player-start');
    if (!video) {
      return;
    }
    if (button) {
      button.addEventListener('click', function () {
        playVideo(video, button);
      });
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo(video, button);
      }
    });
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });
  });
})();
