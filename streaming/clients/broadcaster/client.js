const { connectServerBySocket } = require("../../util");

(async () => {
  const startButton = document.querySelector("#start");
  const nameInput = document.querySelector("#name");

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
})();
