const { connectServerBySocket } = require("../../util");

(async () => {
  const startButton = document.querySelector("#start");
  const nameInput = document.querySelector("#name");

  startButton.onclick = async () => {
    const p = await connectServerBySocket("viewer", nameInput.value);
    p.on("stream", (stream) => {
      console.log("s");
      const video = document.querySelector("#video");
      video.srcObject = stream;
    });
    console.log(nameInput.value);
    const video = document.querySelector("#video");
    try {
      video.play();
    } catch (e) {}
  };
})();
