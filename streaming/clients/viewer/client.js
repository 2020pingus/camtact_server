const { connectServerBySocket } = require("../../util");

(async () => {
  const startButton = document.querySelector("#start");
  const nameInput = document.querySelector("#name");

  startButton.onclick = async () => {
    const p = await connectServerBySocket("viewer", nameInput.value);
    [
      document.querySelector("#up"),
      document.querySelector("#down"),
      document.querySelector("#left"),
      document.querySelector("#right"),
    ].forEach((remoteButton) => {
      console.log(remoteButton.id);
      remoteButton.onmousedown = () => {
        console.log("md");
        p.send(
          JSON.stringify({
            type: "remote",
            value: `direction: ${remoteButton.id}`,
          }),
        );
      };
      remoteButton.onmouseup = () => {
        p.send(JSON.stringify({ type: "remote", value: `stop` }));
      };
    });
    p.on("data", (data) => {
      data = JSON.parse(data.toString());
      console.log(data);
    });
    p.on("stream", (stream) => {
      const video = document.querySelector("#video");
      video.srcObject = stream;
    });
    const video = document.querySelector("#video");
    try {
      video.play();
    } catch (e) {}
  };
})();
