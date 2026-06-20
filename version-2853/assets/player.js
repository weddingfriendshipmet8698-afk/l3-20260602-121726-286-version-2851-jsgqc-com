
import { H as Hls } from './hls-dru42stk.js';

function mountPlayer(player) {
  var video = player.querySelector('video');
  var button = player.querySelector('[data-play-button]');
  var stream = video ? video.getAttribute('data-stream') : '';
  var hls = null;

  if (!video || !button || !stream) {
    return;
  }

  function start() {
    player.classList.add('is-playing');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.play().catch(function () {});
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 36,
        backBufferLength: 18,
        enableWorker: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }

    video.src = stream;
    video.play().catch(function () {});
  }

  button.addEventListener('click', start, { once: true });

  video.addEventListener('click', function () {
    if (video.paused) {
      video.play().catch(function () {});
    } else {
      video.pause();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
}

Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(mountPlayer);
