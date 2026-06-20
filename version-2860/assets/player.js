function initMoviePlayer(videoId, buttonId, streamUrl) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  var attached = false;

  function attachStream() {
    if (attached || !video) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return;
    }

    video.src = streamUrl;
  }

  function startPlay() {
    attachStream();
    if (button) {
      button.classList.add("hidden");
    }
    video.controls = true;
    var playing = video.play();
    if (playing && typeof playing.catch === "function") {
      playing.catch(function () {
        if (button) {
          button.classList.remove("hidden");
        }
      });
    }
  }

  if (button) {
    button.addEventListener("click", startPlay);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (video.paused) {
        startPlay();
      }
    });
  }
}
