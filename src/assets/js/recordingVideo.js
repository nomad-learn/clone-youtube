const recordContainer = document.getElementById("jsRecordContainer");
const videoPreview = document.getElementById("jsRecordingPreview");
const recordingStartBtn = document.getElementById("jsRecordingBtn");

let streamObject;
let mediaRecorder;
let stream;

function handleSaveVideo(event) {
  const { data: videoFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "Recording.mp4";
  document.body.appendChild(link);
  link.click();
  streamObject.getVideoTracks()[0].stop();
  mediaRecorder.removeEventListener("dataavailable", handleSaveVideo);
}

function handleStopRecording() {
  mediaRecorder.stop();
  recordingStartBtn.removeEventListener("click", handleStopRecording);
  // eslint-disable-next-line no-use-before-define
  recordingStartBtn.addEventListener("click", handleRecordingClick);
  recordingStartBtn.innerHTML = "start recording";
  recordingStartBtn.style.backgroundColor = "rgb(50, 113, 206)";
}

function recordingVideo() {
  mediaRecorder = new MediaRecorder(streamObject);
  mediaRecorder.start();
  mediaRecorder.addEventListener("dataavailable", handleSaveVideo);
  recordingStartBtn.addEventListener("click", handleStopRecording);
}

async function handleRecordingClick() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { width: 1280, height: 720 },
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
