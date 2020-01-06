const recordContainer = document.getElementById("jsRecordContainer");
const videoPreview = document.getElementById("jsRecordingPreview");
const recordingStartBtn = document.getElementById("jsRecordingBtn");

let streamObject;

function handleSaveVideo(event) {
  console.log(event);
}

function recordingVideo() {
  const mediaRecorder = new MediaRecorder(streamObject);
  mediaRecorder.start();
  mediaRecorder.addEventListener("dataavailable", handleSaveVideo);
}

async function handleRecordingClick() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 }
    });
    videoPreview.srcObject = stream;
    videoPreview.play();
    videoPreview.muted = true;
    recordingStartBtn.innerHTML = "stop recording";
    recordingStartBtn.style.backgroundColor = "#D93A3A";
    streamObject = stream;
    recordingVideo();
  } catch (error) {
    recordingStartBtn.innerHTML = "Not recording❌";
  } finally {
    recordingStartBtn.removeEventListener("click", handleRecordingClick);
  }
}

function init() {
  recordingStartBtn.addEventListener("click", handleRecordingClick);
}

if (recordContainer) {
  init();
}
