const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.getElementById("jsVideo");
const playButton = document.getElementById("jsPlayBtn");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullscreenBtn = document.getElementById("jsFullscreenBtn");
const currentTime = document.getElementById("jsCurrentTime");
const totalTime = document.getElementById("jsTotalTime");
const volumeRange = document.getElementById("jsVolumeRange");

function handlePlayBtn() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playButton.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumeBtn() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = videoPlayer.volume;
    videoPlayer.volume = volumeRange.value;
  } else {
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeRange.value = 0;
  }
}

function controlBoxHidden() {
  if (videoContainer.className === "videoPlayer hidden") {
    videoContainer.classList.remove("hidden");
  } else {
    videoContainer.classList.add("hidden");
  }
}

function handleFullscreenBtn() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fullscreenBtn.innerHTML = '<i class="fas fa-expand-alt"></i>';
  } else {
    videoContainer.requestFullscreen();
    fullscreenBtn.innerHTML = '<i class="fas fa-compress-alt"></i>';
    videoPlayer.addEventListener("click", controlBoxHidden);
    fullscreenBtn.addEventListener("pointerup", e => {
      if (e.type === "pointerup") {
        videoPlayer.removeEventListener("click", controlBoxHidden);
      }
    });
  }
}

//  time conversion

function formatData(seconds) {
  const secondNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondNumber / 3600);
  let minutes = Math.floor((secondNumber - hours * 3600) / 60);
  let totalSeconds = secondNumber - hours * 3600 - minutes * 60;
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
}

function setCurrentTime() {
  currentTime.innerHTML = formatData(videoPlayer.currentTime);
}

function setTotalTime() {
  const formatTotalTime = formatData(videoPlayer.duration);
  totalTime.innerHTML = formatTotalTime;
  setInterval(setCurrentTime, 1000);
}

function handleVolumeControls() {
  videoPlayer.volume = volumeRange.value;
  volumeRange.addEventListener("pointerup", () => {
    volumeRange.removeEventListener("mousemove", handleVolumeControls);
    videoPlayer.volume = volumeRange.value;
    if (videoPlayer.volume === 0) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  });
}

function handleVolumeBtnClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeRange.addEventListener("mousemove", handleVolumeControls);
  } else {
    volumeRange.addEventListener("mousemove", handleVolumeControls);
  }
}

function handleVideoEnd() {
  videoPlayer.currentTime = 0;
  playButton.innerHTML = '<i class="fas fa-play"></i>';
}

function init() {
  videoPlayer.volume = 0.5;
  playButton.addEventListener("click", handlePlayBtn);
  volumeBtn.addEventListener("click", handleVolumeBtn);
  fullscreenBtn.addEventListener("click", handleFullscreenBtn);
  videoPlayer.addEventListener("loadeddata", setTotalTime);
  videoPlayer.addEventListener("ended", handleVideoEnd);
  volumeRange.addEventListener("pointerdown", handleVolumeBtnClick);
}

if (videoContainer) {
  init();
}
