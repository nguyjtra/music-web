// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End Upload Image


// Upload audio
const uploadAudio = document.querySelector("[upload-audio]");
if(uploadImage) {
  const uploadAudioInput = uploadImage.querySelector("[upload-audio-input]");
  const uploadAudioPlay = uploadImage.querySelector("[upload-audio-play]");
  const source=uploadAudioPlay.querySelector("source");
  uploadAudioInput.addEventListener("change", () => {
    const file = uploadAudioInput.files[0];
    if(file) {
      source.src = URL.createObjectURL(file);
      uploadAudioPlay.load();
    }
  });
}
// End Upload audio