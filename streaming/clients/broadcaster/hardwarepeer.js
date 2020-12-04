const WebSocketAsPromised = require("websocket-as-promised");

class HardwarePeer {
  constructor(url) {
    this.pc = new RTCPeerConnection();
    this.remoteDirection = "stop";
    this.pc.onicecandidate = async ({ candidate }) => {
      if (candidate) {
        const request = {
          what: "addIceCandidate",
          data: JSON.stringify(candidate),
        };
        await this.sendSocket(request);
      }
    };
    this.pc.ondatachannel = (event) => {
      console.log("data channel available");
      this.remoteId = setInterval(() => {
        this.sendDatachannel(this.remoteDirection);
        console.log(this.remoteDirection);
      }, 10);
      this.datachannel = event.channel;
      this.datachannel.onmessage = console.log;
      [
        document.querySelector("#up"),
        document.querySelector("#down"),
        document.querySelector("#left"),
        document.querySelector("#right"),
      ].forEach((remoteButton) => {
        console.log(remoteButton.id);
        remoteButton.onmousedown = () => {
          console.log("r", remoteButton.id);
          this.remoteDirection = remoteButton.id;
          //   this.sendDatachannel(remoteButton.id);

          //   this.sendDatachannel({
          //     type: "remote",
          //     value: `${remoteButton.id}`,
          //   });
        };
        remoteButton.onmouseup = () => {
          //   this.sendDatachannel("stop");
          this.remoteDirection = "stop";
          //   this.sendDatachannel({ type: "remote", value: `stop` });
        };
      });
    };
    this.pc.ontrack = (event) => {
      this.onStream(event.streams[0]);
    };
    this.socket = new WebSocketAsPromised(url, {
      packMessage: (data) => JSON.stringify(data),
      unpackMessage: (message) => JSON.parse(message),
    });
    this.socket.onUnpackedMessage.addListener((arg) => this.onMessage(arg));
  }

  onStream(stream) {
    const video = document.querySelector("#video");
    video.srcObject = stream;
    // video.play();
  }

  async onMessage(message) {
    const { what, data } = message;

    if (what === "offer") {
      await this.pc.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(data)),
      );
      await this.pc.setLocalDescription(await this.pc.createAnswer());
      const answer = {
        what: "answer",
        data: JSON.stringify(this.pc.localDescription),
      };
      await this.sendSocket(answer);
    }

    if (what === "iceCandidate") {
      if (!data) return;
      const candidate = new RTCIceCandidate(JSON.parse(data));
      await this.pc.addIceCandidate(candidate);
    }

    if (what === "message") {
      console.log(message);
    }
  }

  async init() {
    await this.socket.open();
    await this.sendSocket({
      what: "call",
      options: {
        force_hw_vcodec: true,
        vformat: 30,
        trickle_ice: true,
      },
    });
  }

  sendDatachannel(data) {
    if (!this.datachannel) return;
    this.datachannel.send(data);
    // this.datachannel.send(JSON.stringify(data));
  }

  async sendSocket(request) {
    this.socket.sendPacked(request);
  }

  async close() {
    await this.socket.close();
  }
}

module.exports = { HardwarePeer };
