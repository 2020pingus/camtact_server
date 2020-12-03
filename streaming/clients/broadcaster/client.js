const { connectServerBySocket } = require("../../util");

(async () => {
  const startButton = document.querySelector("#start");
  const nameInput = document.querySelector("#name");

  startButton.onclick = async () => {
    const p = await connectServerBySocket("broadcaster", nameInput.value);
    console.log(nameInput.value);
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    p.addStream(stream);
  };
})();
