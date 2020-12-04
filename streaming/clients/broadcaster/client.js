const { connectServerBySocket } = require("../../util");

const { HardwarePeer } = require("./hardwarepeer");

(async () => {
  const startButton = document.querySelector("#start");
  const start2Button = document.querySelector("#start2");
  const nameInput = document.querySelector("#name");
  const urlInput = document.querySelector("#url");

  startButton.onclick = async () => {
    const p = await connectServerBySocket("broadcaster", nameInput.value);
    p.on("data", (data) => {
      data = JSON.parse(data.toString());
      console.log(data);
    });
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    if (stream) p.addStream(stream);
  };

  start2Button.onclick = async () => {
    const hardwarePeer = new HardwarePeer(urlInput.value);
    await hardwarePeer.init();
  };
})();
